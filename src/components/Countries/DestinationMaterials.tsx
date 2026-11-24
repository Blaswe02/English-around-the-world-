import { useEffect, useRef, useState } from 'react';
import { useAuth } from '../../auth/AuthProvider';
import { LEVELS } from '../../data/countries';
import { archiveResource, downloadResource, listResources, uploadResource, type DestinationResource, type ResourceCategory } from '../../services/destinationResources';
import type { Level } from '../../types/curriculum';
export function DestinationMaterials({countryId,countryTitle,category,level,isTeacher}:{countryId:string;countryTitle:string;category:ResourceCategory;level:Level;isTeacher:boolean}){
 const {user}=useAuth();const [resources,setResources]=useState<DestinationResource[]>([]),[busy,setBusy]=useState(true),[working,setWorking]=useState(false),[error,setError]=useState(''),[notice,setNotice]=useState('');
 const [title,setTitle]=useState(''),[studyLevel,setStudyLevel]=useState<Level|'ALL'>(level),[file,setFile]=useState<File|null>(null),[showArchived,setShowArchived]=useState(false);
 const input=useRef<HTMLInputElement>(null);
 const heading=category==='handout'?'Keyterms & handouts':'Extra materials';
 async function refresh(){setResources(await listResources(countryId,category));}
 useEffect(()=>{let active=true;setBusy(true);setError('');listResources(countryId,category).then(rows=>{if(active)setResources(rows);}).catch(e=>{if(active)setError((e as Error).message);}).finally(()=>{if(active)setBusy(false);});return()=>{active=false;};},[countryId,category,user?.id,level]);
 const visible=resources.filter(r=>!r.archived_at||(isTeacher&&showArchived));
 return <section className="content-panel destination-materials"><h3>{heading} · {countryTitle}</h3><p>{category==='handout'?'Download the keyterms and handouts for this destination.':'Download additional worksheets, activities and classroom resources.'}</p>
 {busy&&<p role="status">Loading materials…</p>}
 {error&&<p role="alert" className="form-error">{error}</p>}
 {notice&&<p role="status" className="form-success">{notice}</p>}
 {!busy&&!visible.length&&<p className="materials-empty">No {category==='handout'?'keyterms or handouts':'extra materials'} have been added for your level yet.</p>}
 <ul className="materials-list">{visible.map(resource=><li key={resource.id}><div><strong>{resource.title}</strong><small>{resource.study_level==='ALL'?'All levels':resource.study_level} · {resource.file_name} · {(resource.size_bytes/1024/1024).toFixed(1)} MB{resource.archived_at?' · Archived':''}</small></div><div className="materials-actions"><button className="button button-teal" disabled={working} onClick={async()=>{setWorking(true);setError('');try{await downloadResource(resource);}catch(e){setError((e as Error).message);}finally{setWorking(false);}}}>Download</button>{isTeacher&&<button className="text-button" disabled={working} onClick={async()=>{setWorking(true);setError('');try{await archiveResource(resource.id,!resource.archived_at);await refresh();setNotice(resource.archived_at?'Material restored.':'Material archived. You can restore it using Show archived materials.');}catch(e){setError((e as Error).message);}finally{setWorking(false);}}}>{resource.archived_at?'Restore':'Archive'}</button>}</div></li>)}</ul>
 {isTeacher&&<><label className="materials-archived"><input type="checkbox" checked={showArchived} onChange={e=>setShowArchived(e.target.checked)}/>Show archived materials</label><form className="materials-upload" onSubmit={async e=>{e.preventDefault();if(!file||!user)return;setWorking(true);setError('');setNotice('');try{await uploadResource(countryId,category,title,studyLevel,file,user.id);setTitle('');setFile(null);if(input.current)input.current.value='';await refresh();setNotice('Material uploaded. Students can download it when this destination is open for their year and level.');}catch(e){setError((e as Error).message);}finally{setWorking(false);}}}>
 <h4>Add {category==='handout'?'keyterms or a handout':'extra material'}</h4><label>Title<input required maxLength={120} value={title} onChange={e=>setTitle(e.target.value)}/></label>
 <label>Level<select value={studyLevel} onChange={e=>setStudyLevel(e.target.value as Level|'ALL')}><option value="ALL">All levels</option>{LEVELS.map(l=><option key={l}>{l}</option>)}</select></label>
 <label>File<input ref={input} type="file" required accept=".pdf,.doc,.docx,.ppt,.pptx,.png,.jpg,.jpeg" onChange={e=>setFile(e.target.files?.[0]||null)}/></label><p>PDF, Word, PowerPoint or an image · up to 20 MB</p>
 <button className="button button-teal" disabled={working||!file}>{working?'Please wait…':'Upload material'}</button>
 </form></>}
 </section>;
}
