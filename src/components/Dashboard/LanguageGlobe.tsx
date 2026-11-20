import { useEffect, useRef, useState } from 'react';
import { Pause, Play } from 'lucide-react';

type Feature = {type:string; properties:{name:string;iso:string}; geometry:object};
type Projection = { (point:[number,number]):[number,number]|null; scale(n:number):Projection; translate(p:[number,number]):Projection; rotate(p:[number,number,number]):Projection; clipAngle(n:number):Projection };
type GeoPath = { (feature:object):string|null; pointRadius(n:number):GeoPath };
type D3 = {geoOrthographic():Projection;geoPath(p:Projection):GeoPath;geoGraticule10():object;geoDistance(a:[number,number],b:[number,number]):number};
let library:Promise<D3>|undefined;
function loadD3():Promise<D3>{
 if(!library) library=new Promise((resolve,reject)=>{
  const current=(window as Window & {d3?:D3}).d3;
  if(current){resolve(current);return;}
  const script=document.createElement('script');script.src='/vendor/d3.v7.min.js';script.async=true;
  script.onload=()=>{const d3=(window as Window & {d3?:D3}).d3;d3?resolve(d3):reject(new Error('Map unavailable'));};
  script.onerror=()=>{library=undefined;reject(new Error('Map unavailable'));};
  document.head.appendChild(script);
 });
 return library;
}
// National official status, reviewed 20 November 2026. See public/data/globe-sources.md.
// UK, Australia and Mauritius use English de facto and have a separate gold key.
const official=new Set('USA CAN IRL NZL IND PAK PHL SGP FJI PNG SLB VUT WSM TON TUV KIR NRU PLW FSM MHL MLT NGA GHA GMB SLE LBR CMR KEN UGA TZA RWA BDI SSD SDN ZMB ZWE BWA NAM ZAF LSO SWZ MWI SYC BHS BRB BLZ GUY JAM TTO ATG DMA GRD KNA LCA VCT'.split(' '));
const national=new Set(['GBR','AUS','MUS']);
const smallStates:[string,number,number][]=[
 ['SGP',103.82,1.35],['MLT',14.38,35.94],['SYC',55.45,-4.62],['MUS',57.55,-20.2],
 ['BRB',-59.54,13.19],['ATG',-61.8,17.1],['DMA',-61.36,15.41],['GRD',-61.68,12.12],
 ['KNA',-62.75,17.3],['LCA',-60.98,13.91],['VCT',-61.2,13.25],
 ['TON',-175.2,-21.18],['TUV',179.2,-8.5],['KIR',172.98,1.45],['NRU',166.93,-0.52],
 ['PLW',134.5,7.5],['FSM',158.2,6.9],['MHL',171.38,7.1],['WSM',-172.1,-13.76]
];

export function LanguageGlobe(){
 const host=useRef<HTMLDivElement>(null);
 const svg=useRef<SVGSVGElement>(null);
 const pausedRef=useRef(false);
 const [paused,setPaused]=useState(()=>window.matchMedia('(prefers-reduced-motion: reduce)').matches);
 const [failed,setFailed]=useState(false);
 useEffect(()=>{pausedRef.current=paused;},[paused]);
 useEffect(()=>{
  const controller=new AbortController();let stop=false,frame=0;
  let observer:IntersectionObserver|undefined;
  const cleanups:(()=>void)[]=[];
  Promise.all([loadD3(),fetch('/data/english-globe.json',{signal:controller.signal}).then(r=>{if(!r.ok)throw new Error('Map unavailable');return r.json() as Promise<{features:Feature[]}>;})]).then(([d3,world])=>{
   if(stop||!svg.current)return;
   const root=svg.current;root.replaceChildren();
   const ns='http://www.w3.org/2000/svg';
   const element=(tag:string,attrs:Record<string,string>,parent:Element=root)=>{const node=document.createElementNS(ns,tag);Object.entries(attrs).forEach(([k,v])=>node.setAttribute(k,v));parent.appendChild(node);return node;};
   const defs=element('defs',{});
   const gradient=element('radialGradient',{id:'eatw-ocean',cx:'32%',cy:'26%',r:'78%'},defs);
   [['0%','#357b7a'],['65%','#164b52'],['100%','#0d303c']].forEach(([offset,color])=>element('stop',{offset,'stop-color':color},gradient));
   element('circle',{cx:'210',cy:'210',r:'183',fill:'url(#eatw-ocean)',stroke:'#749b90','stroke-width':'1'});
   const grid=element('path',{fill:'none',stroke:'#c0ddd0','stroke-width':'.45',opacity:'.22'});
   const countries=world.features.map(f=>({f,node:element('path',{fill:official.has(f.properties.iso)?'#f16d58':national.has(f.properties.iso)?'#e1b866':'#a5b9a2',stroke:'#183f42','stroke-width':'.55','stroke-linejoin':'round',...(official.has(f.properties.iso)?{class:'language-country-glow'}:{})})}));
   const dots=smallStates.map(([iso,lon,lat])=>({iso,point:[lon,lat] as [number,number],node:element('circle',{r:'2.1',fill:official.has(iso)?'#ff8970':'#e1b866',stroke:'#173f42','stroke-width':'.4',class:'language-country-glow'})}));
   element('circle',{cx:'210',cy:'210',r:'187',fill:'none',stroke:'#598d80','stroke-width':'.6',opacity:'.4'});
   const projection=d3.geoOrthographic().scale(183).translate([210,210]).clipAngle(90);
   const path=d3.geoPath(projection);
   let longitude=-12,latitude=-15,visible=true,dragging=false,lastX=0,lastY=0,lastDraw=0;
   const draw=()=>{
    projection.rotate([longitude,latitude,0]);
    grid.setAttribute('d',path(d3.geoGraticule10())||'');
    countries.forEach(({f,node})=>node.setAttribute('d',path(f)||''));
    dots.forEach(({point,node})=>{const p=projection(point);const front=d3.geoDistance(point,[-longitude,-latitude])<Math.PI/2;node.setAttribute('visibility',front?'visible':'hidden');if(p){node.setAttribute('cx',String(p[0]));node.setAttribute('cy',String(p[1]));}});
   };
   draw();
   if(host.current){observer=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;});observer.observe(host.current);}
   const down=(e:PointerEvent)=>{if(e.button!==0)return;dragging=true;lastX=e.clientX;lastY=e.clientY;root.setPointerCapture(e.pointerId);};
   const move=(e:PointerEvent)=>{if(!dragging)return;longitude+=(e.clientX-lastX)*.35;latitude=Math.max(-65,Math.min(65,latitude-(e.clientY-lastY)*.35));lastX=e.clientX;lastY=e.clientY;draw();};
   const up=()=>{dragging=false;};
   root.addEventListener('pointerdown',down);root.addEventListener('pointermove',move);root.addEventListener('pointerup',up);root.addEventListener('pointercancel',up);
   cleanups.push(()=>{root.removeEventListener('pointerdown',down);root.removeEventListener('pointermove',move);root.removeEventListener('pointerup',up);root.removeEventListener('pointercancel',up);});
   const tick=(time:number)=>{if(stop)return;if(visible&&!document.hidden&&!pausedRef.current&&!dragging&&time-lastDraw>40){longitude+=Math.min(time-lastDraw,100)*.0025;draw();lastDraw=time;}frame=requestAnimationFrame(tick);};
   frame=requestAnimationFrame(tick);
  }).catch(()=>{if(!stop)setFailed(true);});
  return()=>{stop=true;controller.abort();cancelAnimationFrame(frame);observer?.disconnect();cleanups.forEach(fn=>fn());};
 },[]);
 return <div className="language-globe" ref={host}>
  <div className="language-globe-orbit" aria-hidden="true"/>
  <svg ref={svg} viewBox="0 0 420 420" role="img" aria-label="Rotating world globe. Coral red marks countries where English has official status. Gold marks the United Kingdom, Australia and Mauritius, where English is used de facto. Small islands are shown as dots. Drag to turn the globe.">
   <circle cx="210" cy="210" r="183" fill="#164b52"/><path d="M27 210h366M210 27a110 183 0 010 366 110 183 0 010-366" fill="none" stroke="#8bb2a3"/>
  </svg>
  <div className="language-globe-caption"><span><i/>English has official status</span><button type="button" onClick={()=>setPaused(v=>!v)} aria-label={paused?'Resume globe rotation':'Pause globe rotation'} title={paused?'Resume rotation':'Pause rotation'}>{paused?<Play size={14}/>:<Pause size={14}/>}</button></div>
  <p className="language-globe-key"><i/>English used de facto · small states shown as dots</p>
  {failed&&<p role="status" className="language-globe-key">The map could not load. Please refresh to try again.</p>}
 </div>;
}
