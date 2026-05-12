import React, { useEffect, useRef } from 'react';
import Markdown from 'react-markdown';
import mermaid from 'mermaid';

mermaid.initialize({
  startOnLoad: false,
  theme: 'base',
  themeVariables: {
    background: 'transparent',
    fontFamily: 'ui-sans-serif, system-ui, sans-serif',
    primaryColor: '#0a0a0a',
    primaryTextColor: '#e0e0e0',
    primaryBorderColor: '#10b981', // emerald-500
    lineColor: '#34d399', // emerald-400
    secondaryColor: '#064e3b', // emerald-900
    tertiaryColor: '#111111',
    noteBkgColor: '#022c22', // emerald-950
    noteTextColor: '#e0e0e0',
    noteBorderColor: '#059669', // emerald-600
  }
});

const Mermaid = ({ chart }: { chart: string }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    let mounted = true;
    if (containerRef.current) {
      mermaid.render(`mermaid-${Math.random().toString(36).substring(2, 9)}`, chart)
        .then(({ svg }) => {
          if (mounted && containerRef.current) {
            containerRef.current.innerHTML = svg;
          }
        })
        .catch(err => {
          console.error("Mermaid parsing issue", err);
          if (mounted && containerRef.current) {
             containerRef.current.innerHTML = `<div class="text-red-400 text-xs p-2 border border-red-500/20 bg-red-950/30">Failed to render Mermaid diagram</div>`;
          }
        });
    }
    return () => { mounted = false; };
  }, [chart]);

  return <div ref={containerRef} className="my-6 flex justify-center bg-transparent border border-white/5 p-6 rounded-lg overflow-auto w-full" />;
};

export const MarkdownRenderer = ({ content }: { content: string }) => {
  return (
    <div className="markdown-body prose prose-invert prose-sm max-w-none text-[#e0e0e0]/80">
      <Markdown
        components={{
          code({node, className, children, ...props}: any) {
            const match = /language-(\w+)/.exec(className || '');
            if (match && match[1] === 'mermaid') {
              return <Mermaid chart={String(children).replace(/\n$/, '')} />;
            }
            return match ? (
              <code className={className} {...props}>{children}</code>
            ) : (
              <code className="bg-white/10 px-1 py-0.5 rounded text-emerald-400 font-mono text-[11px] whitespace-pre-wrap" {...props}>{children}</code>
            );
          },
          pre({children, ...props}: any) {
            const isMermaid = (children as any)?.props?.className?.includes('language-mermaid');
            if (isMermaid) return <>{children}</>;
            return <pre className="bg-[#050505] p-3 rounded-md overflow-x-auto text-xs my-3 border border-white/10" {...props}>{children}</pre>;
          },
          p({children, ...props}: any) {
            return <p className="mb-3 leading-relaxed" {...props}>{children}</p>;
          },
          ul({children, ...props}: any) {
            return <ul className="list-disc pl-5 mb-3 space-y-1" {...props}>{children}</ul>;
          },
          ol({children, ...props}: any) {
            return <ol className="list-decimal pl-5 mb-3 space-y-1" {...props}>{children}</ol>;
          },
          h1({children, ...props}: any) {
            return <h1 className="text-xl font-serif text-white mt-6 mb-3" {...props}>{children}</h1>;
          },
          h2({children, ...props}: any) {
             return <h2 className="text-lg font-serif text-white mt-5 mb-2 border-b border-white/10 pb-1" {...props}>{children}</h2>;
          },
          h3({children, ...props}: any) {
             return <h3 className="text-base font-serif text-white mt-4 mb-2" {...props}>{children}</h3>;
          },
          h4({children, ...props}: any) {
             return <h4 className="text-sm font-semibold text-white mt-3 mb-1" {...props}>{children}</h4>;
          },
          a({href, children, ...props}: any) {
             return <a href={href} target="_blank" rel="noreferrer" className="text-blue-400 hover:text-blue-300 underline" {...props}>{children}</a>;
          }
        }}
      >
        {content}
      </Markdown>
    </div>
  );
};
