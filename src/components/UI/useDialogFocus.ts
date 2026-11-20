import { useEffect, useRef } from 'react';
export function useDialogFocus(onClose?:()=>void) {
 const ref=useRef<HTMLDivElement>(null);
 useEffect(()=>{
  const previous=document.activeElement as HTMLElement|null;
  const root=ref.current;
  if(!root)return;
  const focusables=()=>Array.from(root.querySelectorAll<HTMLElement>('button:not(:disabled),input,select,textarea,a[href],[tabindex="0"]'));
  focusables()[0]?.focus();
  const listener=(e:KeyboardEvent)=>{
   if(e.key==='Escape'&&onClose){e.preventDefault();onClose();return;}
   if(e.key==='Tab'){
    const elements=focusables();const first=elements[0];const last=elements.at(-1);
    if(e.shiftKey&&(document.activeElement===first||!root.contains(document.activeElement))){e.preventDefault();last?.focus();}
    else if(!e.shiftKey&&(document.activeElement===last||!root.contains(document.activeElement))){e.preventDefault();first?.focus();}
   }
  };
  document.addEventListener('keydown',listener);
  return()=>{document.removeEventListener('keydown',listener);previous?.focus();};
 },[onClose]);
 return ref;
}
