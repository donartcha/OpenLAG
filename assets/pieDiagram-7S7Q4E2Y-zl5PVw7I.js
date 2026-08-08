import{p as et}from"./chunk-JWPE2WC7-2QdYP6lX.js";import{s as at}from"./mermaid.core-BXqel400.js";import{g as rt,s as it,f as nt,h as st,x as ot,v as lt,_ as l,l as E,j as ct,J as dt,N as gt,O as U,Q as ht,m as pt,y as ft,S as ut,K as mt}from"./vendor-flow-B9XfSoyx.js";import{p as vt}from"./cynefin-VYW2F7L2-BXHLKbdc.js";import"./vendor-ui-BhsJ3_oc.js";import"./vendor-docs-D093Cl1e.js";var St=mt.pie,R={sections:new Map,showData:!1},T=R.sections,L=R.showData,xt=structuredClone(St),wt=l(()=>structuredClone(xt),"getConfig"),Ct=l(()=>{T=new Map,L=R.showData,ft()},"clear"),$t=l(({label:t,value:a})=>{if(a<0)throw new Error(`"${t}" has invalid value: ${a}. Negative values are not allowed in pie charts. All slice values must be >= 0.`);T.has(t)||(T.set(t,a),E.debug(`added new section: ${t}, with value: ${a}`))},"addSection"),yt=l(()=>T,"getSections"),Dt=l(t=>{L=t},"setShowData"),Tt=l(()=>L,"getShowData"),j={getConfig:wt,clear:Ct,setDiagramTitle:lt,getDiagramTitle:ot,setAccTitle:st,getAccTitle:nt,setAccDescription:it,getAccDescription:rt,addSection:$t,getSections:yt,setShowData:Dt,getShowData:Tt},bt=l((t,a)=>{et(t,a),a.setShowData(t.showData),t.sections.map(a.addSection)},"populateDb"),At={parse:l(async t=>{const a=await vt("pie",t);E.debug(a),bt(a,j)},"parse")},_t=l(t=>`
  .pieCircle{
    stroke: ${t.pieStrokeColor};
    stroke-width : ${t.pieStrokeWidth};
    opacity : ${t.pieOpacity};
  }
  .pieCircle.highlighted{
    scale: 1.05;
    opacity: 1;
  }
  .pieCircle.highlightedOnHover:hover{
    transition-duration: 250ms;
    scale: 1.05;
    opacity: 1;
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
`,"getStyles"),kt=_t,zt=l(t=>{const a=[...t.values()].reduce((s,m)=>s+m,0),O=[...t.entries()].map(([s,m])=>({label:s,value:m})).filter(s=>s.value/a*100>=1);return ut().value(s=>s.value).sort(null)(O)},"createPieArcs"),Et=l((t,a,O,W)=>{var I;E.debug(`rendering pie chart
`+t);const s=W.db,m=ct(),p=dt(s.getConfig(),m.pie),F=40,i=18,c=4,C=450,S=C,b=at(a),$=b.append("g");$.attr("transform","translate("+S/2+","+C/2+")");const{themeVariables:n}=m;let[H]=gt(n.pieOuterStrokeWidth);H??(H=2);const J=p.legendPosition,M=p.textPosition,K=p.donutHole>0&&p.donutHole<=.9?p.donutHole:0,f=Math.min(S,C)/2-F,Q=U().innerRadius(K*f).outerRadius(f),V=U().innerRadius(f*M).outerRadius(f*M),x=$.append("g");x.append("circle").attr("cx",0).attr("cy",0).attr("r",f+H/2).attr("class","pieOuterCircle");const y=s.getSections(),X=zt(y),Z=[n.pie1,n.pie2,n.pie3,n.pie4,n.pie5,n.pie6,n.pie7,n.pie8,n.pie9,n.pie10,n.pie11,n.pie12];let A=0;y.forEach(e=>{A+=e});const P=X.filter(e=>(e.data.value/A*100).toFixed(0)!=="0"),_=ht(Z).domain([...y.keys()]);x.selectAll("mySlices").data(P).enter().append("path").attr("d",Q).attr("fill",e=>_(e.data.label)).attr("class",e=>{let r="pieCircle";return p.highlightSlice==="hover"?r+=" highlightedOnHover":p.highlightSlice===e.data.label&&(r+=" highlighted"),r}),x.selectAll("mySlices").data(P).enter().append("text").text(e=>(e.data.value/A*100).toFixed(0)+"%").attr("transform",e=>"translate("+V.centroid(e)+")").style("text-anchor","middle").attr("class","slice");const q=$.append("text").text(s.getDiagramTitle()).attr("x",0).attr("y",-400/2).attr("class","pieTitleText"),w=[...y.entries()].map(([e,r])=>({label:e,value:r})),u=$.selectAll(".legend").data(w).enter().append("g").attr("class","legend");u.append("rect").attr("width",i).attr("height",i).style("fill",e=>_(e.label)).style("stroke",e=>_(e.label)),u.append("text").attr("x",i+c).attr("y",i-c).text(e=>s.getShowData()?`${e.label} [${e.value}]`:e.label);const v=Math.max(...u.selectAll("text").nodes().map(e=>(e==null?void 0:e.getBoundingClientRect().width)??0));let D=C,k=S+F;const o=i+c,z=w.length*o;switch(J){case"center":u.attr("transform",(e,r)=>{const d=o*w.length/2,g=-v/2-(i+c),h=r*o-d;return"translate("+g+","+h+")"});break;case"top":D+=z,u.attr("transform",(e,r)=>{const d=f,g=-v/2-(i+c),h=r*o-d;return`translate(${g}, ${h})`}),x.attr("transform",()=>`translate(0, ${z+o})`);break;case"bottom":D+=z,u.attr("transform",(e,r)=>{const d=-f-o,g=-v/2-(i+c),h=r*o-d;return"translate("+g+","+h+")"});break;case"left":k+=i+c+v,u.attr("transform",(e,r)=>{const d=o*w.length/2,g=-f-(i+c),h=r*o-d;return"translate("+g+","+h+")"}),x.attr("transform",()=>`translate(${v+i+c}, 0)`);break;case"right":default:k+=i+c+v,u.attr("transform",(e,r)=>{const d=o*w.length/2,g=12*i,h=r*o-d;return"translate("+g+","+h+")"});break}const G=((I=q.node())==null?void 0:I.getBoundingClientRect().width)??0,Y=S/2-G/2,tt=S/2+G/2,N=Math.min(0,Y),B=Math.max(k,tt)-N;b.attr("viewBox",`${N} 0 ${B} ${D}`),pt(b,D,B,p.useMaxWidth)},"draw"),Rt={draw:Et},Gt={parser:At,db:j,renderer:Rt,styles:kt};export{Gt as diagram};
