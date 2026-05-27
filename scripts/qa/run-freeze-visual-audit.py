import argparse
import json
import math
import re
from collections import defaultdict
from pathlib import Path

import fitz


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Run visual/structural QA on freeze PDFs.")
    parser.add_argument(
        "--root",
        default=".",
        help="Repository root path (defaults to current directory).",
    )
    parser.add_argument(
        "--pdf-dir",
        default="test-results/freeze",
        help="Directory containing generated freeze PDFs.",
    )
    parser.add_argument(
        "--template-dir",
        default="templates/freeze",
        help="Directory containing freeze templates.",
    )
    parser.add_argument(
        "--report-prefix",
        default="FREEZE_VISUAL_AUDIT_REPORT",
        help="Output report file prefix.",
    )
    return parser.parse_args()


def luminance_stats(pix: fitz.Pixmap) -> tuple[float, float]:
    n = pix.n
    step = n
    total = pix.width * pix.height
    if total == 0:
        return 0.0, 0.0

    mean = 0.0
    m2 = 0.0
    count = 0
    samples = pix.samples
    for i in range(0, len(samples), step):
        r = samples[i]
        g = samples[i + 1]
        b = samples[i + 2]
        lum = 0.2126 * r + 0.7152 * g + 0.0722 * b
        count += 1
        delta = lum - mean
        mean += delta / count
        m2 += delta * (lum - mean)
    variance = m2 / count if count else 0.0
    return mean, math.sqrt(max(variance, 0.0))


def intersects(a, b):
    x0 = max(a[0], b[0])
    y0 = max(a[1], b[1])
    x1 = min(a[2], b[2])
    y1 = min(a[3], b[3])
    return x1 > x0 and y1 > y0


def infer_template(pdf_name: str) -> str:
    n = pdf_name.lower()
    if "technical-manual" in n:
        return "technical-manual.html"
    if "executive-brief" in n:
        return "executive-brief.html"
    if "knowledge-map" in n:
        return "knowledge-map.html"
    if "audit-dossier" in n:
        return "audit-dossier.html"
    return "freeze-template.html"


def main() -> int:
    args = parse_args()
    root = Path(args.root).resolve()
    pdf_dir = (root / args.pdf_dir).resolve()
    template_dir = (root / args.template_dir).resolve()

    out_dir = pdf_dir / "audit-evidence"
    out_dir.mkdir(parents=True, exist_ok=True)

    pdfs = sorted(pdf_dir.glob("*.pdf"))
    templates = sorted(template_dir.glob("*.html"))

    issues = []
    summary = {}

    for pdf in pdfs:
        doc = fitz.open(pdf)
        out = out_dir / pdf.stem
        out.mkdir(exist_ok=True)

        margins = []
        headings = []
        images_total = 0
        draws_total = 0

        for i, page in enumerate(doc):
            pix = page.get_pixmap(matrix=fitz.Matrix(1.4, 1.4), alpha=False)
            ev = out / f"page-{i + 1:03d}.png"
            pix.save(ev)

            text = page.get_text("text")
            for line in text.splitlines():
                if re.match(r"^\d+(\.\d+)*\s+\S+", line.strip()):
                    headings.append(line.strip())

            text_dict = page.get_text("dict")
            w, h = page.rect.width, page.rect.height

            text_boxes = []
            near_edge = 0
            tiny = 0
            spans = 0

            for block in text_dict.get("blocks", []):
                if block.get("type") != 0:
                    continue
                if block.get("bbox"):
                    text_boxes.append(block["bbox"])
                for ln in block.get("lines", []):
                    for sp in ln.get("spans", []):
                        spans += 1
                        sx0, sy0, sx1, sy1 = sp.get("bbox", [0, 0, 0, 0])
                        if sx0 < 14 or sy0 < 14 or (w - sx1) < 14 or (h - sy1) < 14:
                            near_edge += 1
                        if sp.get("size", 0) < 7:
                            tiny += 1

            overlap = 0
            for a in range(len(text_boxes)):
                for b in range(a + 1, len(text_boxes)):
                    if intersects(text_boxes[a], text_boxes[b]):
                        overlap += 1

            min_margin = 999
            for (x0, y0, x1, y1) in text_boxes:
                min_margin = min(min_margin, x0, y0, w - x1, h - y1)
            if min_margin == 999:
                min_margin = 0

            lum_mean, lum_std = luminance_stats(pix)
            images = len(page.get_images(full=True))
            draws = len(page.get_drawings())
            images_total += images
            draws_total += draws
            margins.append(min_margin)

            if overlap > 5:
                issues.append(("critical", pdf.name, i + 1, f"Possible text overlap ({overlap} intersecting blocks)", str(ev)))
            if min_margin < 6:
                issues.append(("major", pdf.name, i + 1, f"Possible clipping / tight margin ({min_margin:.1f}pt)", str(ev)))
            if spans and near_edge / spans > 0.1:
                issues.append(("major", pdf.name, i + 1, "High near-edge text ratio", str(ev)))
            if spans and tiny / spans > 0.35:
                issues.append(("minor", pdf.name, i + 1, "High proportion of tiny text (<7pt)", str(ev)))
            if lum_mean > 254.8 and lum_std < 0.5:
                issues.append(("major", pdf.name, i + 1, "Blank/empty rendered page", str(ev)))
            elif lum_mean > 252.5 and lum_std < 10:
                issues.append(("major", pdf.name, i + 1, "Washed-out / low-contrast page", str(ev)))

        page_text_norm = [re.sub(r"\s+", " ", p.get_text("text")).strip() for p in doc]
        if len(page_text_norm) != len(set(page_text_norm)):
            dup = len(page_text_norm) - len(set(page_text_norm))
            issues.append(("major", pdf.name, None, f"Potential duplicated pages ({dup})", "n/a"))

        if len(doc.get_toc(simple=True)) == 0:
            issues.append(("minor", pdf.name, None, "No PDF bookmarks/outline", "n/a"))

        summary[pdf.name] = {
            "pages": len(doc),
            "headings": len(headings),
            "min_margin_pt": float(min(margins) if margins else 0),
            "images_total": images_total,
            "drawings_total": draws_total,
            "template": infer_template(pdf.name),
        }

    sev_rank = {"critical": 0, "major": 1, "minor": 2}
    issues.sort(key=lambda x: (sev_rank[x[0]], x[1], x[2] or 0))

    scores = defaultdict(lambda: {"critical": 0, "major": 0, "minor": 0})
    for sev, pdf_name, _, _, _ in issues:
        tpl = summary.get(pdf_name, {}).get("template", "unknown")
        scores[tpl][sev] += 1

    md = []
    md.append("# Freeze PDF Visual Audit Report")
    md.append("")
    md.append("## Scope")
    md.append(f"- PDFs audited: {len(pdfs)}")
    md.append(f"- Templates reviewed: {len(templates)}")
    md.append("")
    md.append("## Coverage")
    for name, s in summary.items():
        md.append(f"- {name} -> {s['template']}")
    md.append("")
    md.append("## Per-PDF Snapshot")
    for name, s in summary.items():
        md.append(f"- {name}: pages={s['pages']}, headings={s['headings']}, min_margin={s['min_margin_pt']:.1f}pt, images={s['images_total']}, drawings={s['drawings_total']}")
    md.append("")

    for sev in ["critical", "major", "minor"]:
        group = [i for i in issues if i[0] == sev]
        md.append(f"## {sev.title()} Findings ({len(group)})")
        if not group:
            md.append("- None")
        for _, pdf_name, page, desc, ev in group:
            where = f"page {page}" if page else "document-level"
            md.append(f"- [{pdf_name}] {where}: {desc}. Evidence: {ev}")
        md.append("")

    md.append("## Final Assessment per Template")
    for tpl in sorted([t.name for t in templates]):
        sc = scores[tpl]
        verdict = "READY"
        if sc["critical"] > 0:
            verdict = "NOT READY"
        elif sc["major"] > 0:
            verdict = "CONDITIONALLY READY"
        md.append(f"- {tpl}: {verdict} (critical={sc['critical']}, major={sc['major']}, minor={sc['minor']})")

    md.append("")
    md.append("## Notes")
    md.append("- Stylistic differences tied to branding/layout are acceptable; rendering/readability defects are not.")
    md.append("- This report prioritizes visual integrity, deterministic structure checks, and export professionalism.")

    report_md = pdf_dir / f"{args.report_prefix}.md"
    report_json = pdf_dir / f"{args.report_prefix}.json"
    report_md.write_text("\n".join(md), encoding="utf-8")
    report_json.write_text(json.dumps({"summary": summary, "issues": issues}, indent=2, ensure_ascii=False), encoding="utf-8")

    print(str(report_md))
    print(str(report_json))
    print(str(out_dir))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
