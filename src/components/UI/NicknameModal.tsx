import { useState } from 'react';
import { useDialogFocus } from './useDialogFocus';

export function NicknameModal({onConfirm}:{onConfirm:(n:string)=>void}) {
 const [value,setValue]=useState('');
 const dialogRef=useDialogFocus();
 return <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm"><div ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby="welcome-title" className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl"><div className="bg-[#143b47] text-white p-8"><></><p className="text-xs tracking-widest text-[#bce8d1] mb-2">ENGLISH AROUND THE WORLD</p><h2 id="welcome-title" className="text-3xl font-semibold">Jouw avontuur begint hier.</h2></div><form className="p-8" onSubmit={e=>{e.preventDefault();if(value.trim().length>=2)onConfirm(value.trim());}}><p className="text-sm text-slate-600 mb-5 leading-relaxed">Kies een verzonnen bijnaam voor jouw reis. Geen e-mail of wachtwoord nodig.</p><label htmlFor="nickname" className="text-sm font-bold block mb-2">Hoe mogen we je noemen?</label><input id="nickname" autoFocus required minLength={2} maxLength={20} value={value} onChange={e=>setValue(e.target.value)} placeholder="Bijvoorbeeld: Wereldreiziger" className="border border-slate-300 rounded-xl p-3 w-full mb-3"/><p className="text-xs text-slate-500 mb-5">Je voortgang wordt in deze browser bewaard. Je bijnaam is geen beveiligd account.</p><button className="button button-teal w-full" disabled={value.trim().length<2}>Begin mijn reis</button><button type="button" className="text-sm text-slate-600 block mx-auto mt-4 underline" onClick={()=>onConfirm('reiziger')}>Eerst even rondkijken</button></form></div></div>;
}

