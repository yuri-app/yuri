import{f as V,d as j,g as u,h as b,i as k,w as p,u as a,j as D,k as F,e as G,l as N,m as W,n as q,r as z,o as i,a as d,b as y,p as E,c as C,q as R,F as I,s as O,t as T,_ as A}from"./index-B5zRwVpF.js";typeof WorkerGlobalScope<"u"&&globalThis instanceof WorkerGlobalScope;function H(f,h,m){return V(f,h,{...m,immediate:!0})}const J={class:"flex items-center"},K=d("div",{"flex-1":""},null,-1),M={class:"flex flex-wrap"},Q={class:"grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4"},Y=j({__name:"[path]",props:{scope:{},path:{}},setup(f){const h=F(),m=G(),t=f,$=u([]),g=u(!0),_=u(!0),v=u(""),{layout:l}=N(),x=b(()=>g.value&&_.value),P=b(()=>{if(t.path=="/")return"/";let e=t.path.length-2;for(let n=e;n>=0;n--)if(t.path[n]=="/"){e=n;break}const r=t.path.slice(0,e+1);return`/${t.scope}/${encodeURIComponent(r)}`});async function U(){const e=await W(t.scope);if(g.value=!!e,!!e){v.value=e.origin;try{$.value=await q(e.origin,t.path),_.value=!0}catch{_.value=!1}}}return H(()=>h.fullPath,U),V(x,e=>{e||m.push("/404")}),(e,r)=>{const n=O,B=z("router-link"),L=T,w=A,S=D;return i(),k(S,{value:a($),layout:a(l),"data-key":void 0,"h-full":""},{header:p(()=>[d("div",J,[y(B,{to:a(P)},{default:p(()=>[y(n,{icon:"i-mdi:arrow-left",label:e.$t("tip.back"),size:"small"},null,8,["label"])]),_:1},8,["to"]),K,y(L,{modelValue:a(l),"onUpdate:modelValue":r[0]||(r[0]=c=>E(l)?l.value=c:null)},null,8,["modelValue"])])]),list:p(c=>[d("div",M,[(i(!0),C(I,null,R(c.items,({name:o,type:s})=>(i(),k(w,{key:o+s,class:"w-full p-3",to:s=="directory"?`${e.$route.fullPath}${encodeURIComponent(o+"/")}`:`/file/${encodeURIComponent(a(v)+t.path+o)}`,type:s,name:o,layout:a(l)},null,8,["to","type","name","layout"]))),128))])]),grid:p(c=>[d("div",Q,[(i(!0),C(I,null,R(c.items,({name:o,type:s})=>(i(),k(w,{key:o+s,class:"p-3",to:s=="directory"?`${e.$route.fullPath}${encodeURIComponent(o+"/")}`:`/file/${encodeURIComponent(a(v)+t.path+o)}`,type:s,name:o,layout:a(l)},null,8,["to","type","name","layout"]))),128))])]),_:1},8,["value","layout"])}}});export{Y as default};