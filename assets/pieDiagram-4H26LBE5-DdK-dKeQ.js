import{s as H}from"./mermaid.core-Had4KVjQ.js";import{p as J}from"./chunk-4BX2VUAB-DRDD1flR.js";import{g as K,s as Y,f as tt,h as et,z as at,y as it,_ as s,l as w,j as rt,O as st,T as ot,U as G,V as nt,m as lt,F as ct,W as dt,Q as pt}from"./vendor-flow-CTh03rPZ.js";import{p as gt}from"./wardley-L42UT6IY-DQ7ppcXx.js";import"./vendor-ui-BxlDgOL0.js";import"./vendor-docs-CLrQiCca.js";var ht=pt.pie,C={sections:new Map,showData:!1},u=C.sections,D=C.showData,ut=structuredClone(ht),ft=s(()=>structuredClone(ut),"getConfig"),mt=s(()=>{u=new Map,D=C.showData,ct()},"clear"),vt=s(({label:t,value:a})=>{if(a<0)throw new Error(`"${t}" has invalid value: ${a}. Negative values are not allowed in pie charts. All slice values must be >= 0.`);u.has(t)||(u.set(t,a),w.debug(`added new section: ${t}, with value: ${a}`))},"addSection"),xt=s(()=>u,"getSections"),St=s(t=>{D=t},"setShowData"),wt=s(()=>D,"getShowData"),L={getConfig:ft,clear:mt,setDiagramTitle:it,getDiagramTitle:at,setAccTitle:et,getAccTitle:tt,setAccDescription:Y,getAccDescription:K,addSection:vt,getSections:xt,setShowData:St,getShowData:wt},Ct=s((t,a)=>{J(t,a),a.setShowData(t.showData),t.sections.map(a.addSection)},"populateDb"),Dt={parse:s(async t=>{const a=await gt("pie",t);w.debug(a),Ct(a,L)},"parse")},yt=s(t=>`
  .pieCircle{
    stroke: ${t.pieStrokeColor};
    stroke-width : ${t.pieStrokeWidth};
    opacity : ${t.pieOpacity};
  }
  .pieOuterCircle{
    stroke: ${t.pieOuterStrokeColor};
    stroke-width: ${t.pieOuterStrokeWidth};
    fill: none;
  }
  .pieTitleText {
    text-anchor: middle;
    font-size: ${t.pieTitleTextSize};
    fill: ${t.pieTitleTextColor};
    font-family: ${t.fontFamily};
  }
  .slice {
    font-family: ${t.fontFamily};
    fill: ${t.pieSectionTextColor};
    font-size:${t.pieSectionTextSize};
    // fill: white;
  }
  .legend text {
    fill: ${t.pieLegendTextColor};
    font-family: ${t.fontFamily};
    font-size: ${t.pieLegendTextSize};
  }
`,"getStyles"),$t=yt,Tt=s(t=>{const a=[...t.values()].reduce((r,n)=>r+n,0),y=[...t.entries()].map(([r,n])=>({label:r,value:n})).filter(r=>r.value/a*100>=1);return dt().value(r=>r.value).sort(null)(y)},"createPieArcs"),At=s((t,a,y,$)=>{var F;w.debug(`rendering pie chart
`+t);const r=$.db,n=rt(),T=st(r.getConfig(),n.pie),A=40,o=18,p=4,c=450,d=c,f=H(a),l=f.append("g");l.attr("transform","translate("+d/2+","+c/2+")");const{themeVariables:i}=n;let[_]=ot(i.pieOuterStrokeWidth);_??(_=2);const b=T.textPosition,g=Math.min(d,c)/2-A,O=G().innerRadius(0).outerRadius(g),B=G().innerRadius(g*b).outerRadius(g*b);l.append("circle").attr("cx",0).attr("cy",0).attr("r",g+_/2).attr("class","pieOuterCircle");const h=r.getSections(),P=Tt(h),I=[i.pie1,i.pie2,i.pie3,i.pie4,i.pie5,i.pie6,i.pie7,i.pie8,i.pie9,i.pie10,i.pie11,i.pie12];let m=0;h.forEach(e=>{m+=e});const E=P.filter(e=>(e.data.value/m*100).toFixed(0)!=="0"),v=nt(I).domain([...h.keys()]);l.selectAll("mySlices").data(E).enter().append("path").attr("d",O).attr("fill",e=>v(e.data.label)).attr("class","pieCircle"),l.selectAll("mySlices").data(E).enter().append("text").text(e=>(e.data.value/m*100).toFixed(0)+"%").attr("transform",e=>"translate("+B.centroid(e)+")").style("text-anchor","middle").attr("class","slice");const N=l.append("text").text(r.getDiagramTitle()).attr("x",0).attr("y",-400/2).attr("class","pieTitleText"),k=[...h.entries()].map(([e,S])=>({label:e,value:S})),x=l.selectAll(".legend").data(k).enter().append("g").attr("class","legend").attr("transform",(e,S)=>{const M=o+p,X=M*k.length/2,Z=12*o,q=S*M-X;return"translate("+Z+","+q+")"});x.append("rect").attr("width",o).attr("height",o).style("fill",e=>v(e.label)).style("stroke",e=>v(e.label)),x.append("text").attr("x",o+p).attr("y",o-p).text(e=>r.getShowData()?`${e.label} [${e.value}]`:e.label);const U=Math.max(...x.selectAll("text").nodes().map(e=>(e==null?void 0:e.getBoundingClientRect().width)??0)),V=d+A+o+p+U,R=((F=N.node())==null?void 0:F.getBoundingClientRect().width)??0,j=d/2-R/2,Q=d/2+R/2,W=Math.min(0,j),z=Math.max(V,Q)-W;f.attr("viewBox",`${W} 0 ${z} ${c}`),lt(f,c,z,T.useMaxWidth)},"draw"),_t={draw:At},Mt={parser:Dt,db:L,renderer:_t,styles:$t};export{Mt as diagram};
