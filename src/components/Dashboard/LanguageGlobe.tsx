import { useEffect, useRef, useState } from 'react';

import { DESTINATION_YEARS } from '../../data/countries';

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
// The curriculum route is the source of truth, rather than English-language status.
const routeIds = new Set<string>(DESTINATION_YEARS.flatMap(group => group.destinations.map(destination => destination.id)));
const countryIsoByDestination: Record<string, string> = {
 uk: 'GBR', australia: 'AUS', canada: 'CAN', usa: 'USA',
 india: 'IND', ireland: 'IRL', 'south-africa': 'ZAF', 'new-zealand': 'NZL',
 jamaica: 'JAM', malta: 'MLT', singapore: 'SGP',
};
const selectedCountries = new Set(Object.entries(countryIsoByDestination).filter(([id]) => routeIds.has(id)).map(([, iso]) => iso));
const stateIds: Record<string, string> = { California: 'california', Hawaii: 'hawaii', 'New York': 'new-york', Texas: 'texas' };
const smallDestinations: { id: string; name: string; point: [number, number]; state: boolean }[] = [
 { id: 'singapore', name: 'Singapore', point: [103.82, 1.35], state: false },
 { id: 'malta', name: 'Malta', point: [14.38, 35.94], state: false },
 { id: 'hawaii', name: 'Hawaii', point: [-155.58, 19.9], state: true },
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
  const loadMap = (url: string) => fetch(url, { signal: controller.signal }).then(response => {
   if (!response.ok) throw new Error('Map unavailable');
   return response.json() as Promise<{features:Feature[]}>;
  });
  Promise.all([loadD3(), loadMap('/data/english-globe.json'), loadMap('/data/curriculum-us-states.json')]).then(([d3,world,states])=>{
   if(stop||!svg.current)return;
   const root=svg.current;root.replaceChildren();
   const ns='http://www.w3.org/2000/svg';
   const element=(tag:string,attrs:Record<string,string>,parent:Element=root)=>{const node=document.createElementNS(ns,tag);Object.entries(attrs).forEach(([k,v])=>node.setAttribute(k,v));parent.appendChild(node);return node;};
   const defs=element('defs',{});
   const gradient=element('radialGradient',{id:'eatw-ocean',cx:'32%',cy:'26%',r:'78%'},defs);
   [['0%','#357b7a'],['65%','#164b52'],['100%','#0d303c']].forEach(([offset,color])=>element('stop',{offset,'stop-color':color},gradient));
   element('circle',{cx:'210',cy:'210',r:'183',fill:'url(#eatw-ocean)',stroke:'#749b90','stroke-width':'1'});
   const grid=element('path',{fill:'none',stroke:'#c0ddd0','stroke-width':'.45',opacity:'.22'});
   const countries=world.features.map(f=>{
    const selected=selectedCountries.has(f.properties.iso);
    const node=element('path',{fill:selected?'#f16d58':'#a5b9a2',stroke:'#183f42','stroke-width':'.55','stroke-linejoin':'round',...(selected?{class:'language-country-glow'}:{})});
    element('title',{},node).textContent=f.properties.name;
    return {f,node};
   });
   const statePaths=states.features.filter(f=>routeIds.has(stateIds[f.properties.name])).map(f=>{
    const node=element('path',{fill:'#e1b866',stroke:'#fff1cd','stroke-width':'.85','stroke-linejoin':'round',class:'language-country-glow'});
    element('title',{},node).textContent=f.properties.name+' · Our destination';
    return {f,node};
   });
   const dots=smallDestinations.filter(destination=>routeIds.has(destination.id)).map(destination=>{
    const node=element('circle',{r:'2.3',fill:destination.state?'#e1b866':'#ff8970',stroke:'#173f42','stroke-width':'.4',class:'language-country-glow'});
    element('title',{},node).textContent=destination.name+' · Our destination';
    return {point:destination.point,node};
   });
   element('circle',{cx:'210',cy:'210',r:'187',fill:'none',stroke:'#598d80','stroke-width':'.6',opacity:'.4'});
   const projection=d3.geoOrthographic().scale(183).translate([210,210]).clipAngle(90);
   const path=d3.geoPath(projection);
   let longitude=-12,latitude=-15,visible=true,dragging=false,lastX=0,lastY=0,lastDraw=0;
   const draw=()=>{
    projection.rotate([longitude,latitude,0]);
    grid.setAttribute('d',path(d3.geoGraticule10())||'');
    countries.forEach(({f,node})=>node.setAttribute('d',path(f)||''));
    statePaths.forEach(({f,node})=>node.setAttribute('d',path(f)||''));
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
  <svg ref={svg} viewBox="0 0 420 420" role="img" aria-label="Rotating world globe showing our learning destinations. Coral red: UK, Australia, Canada, USA, India, Ireland, South Africa, New Zealand, Jamaica, Malta and Singapore. Gold: Hawaii, New York, Texas and California. Small destinations are also shown as dots. Drag to turn the globe.">
   <circle cx="210" cy="210" r="183" fill="#164b52"/><path d="M27 210h366M210 27a110 183 0 010 366 110 183 0 010-366" fill="none" stroke="#8bb2a3"/>
  </svg>
  <div className="language-globe-caption"><span><i/>Our destinations</span><button type="button" onClick={()=>setPaused(v=>!v)} aria-label={paused?'Resume globe rotation':'Pause globe rotation'} title={paused?'Resume rotation':'Pause rotation'}>{paused?<>Resume</>:<>Pause</>}</button></div>
  <p className="language-globe-key"><i/>US state destinations · small destinations shown as dots</p>
  {failed&&<p role="status" className="language-globe-key">The map could not load. Please refresh to try again.</p>}
 </div>;
}
