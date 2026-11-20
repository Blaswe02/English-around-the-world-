import { createClient } from 'npm:@supabase/supabase-js@2.106.2';
const allowedOrigins = new Set(['https://english-around-the-world.vercel.app','http://127.0.0.1:4173','http://localhost:4173']);
Deno.serve(async(req:Request)=>{
 const origin=req.headers.get('origin');
 const headers:Record<string,string>={'Content-Type':'application/json','Vary':'Origin','Cache-Control':'no-store'};
 if(origin&&allowedOrigins.has(origin))Object.assign(headers,{'Access-Control-Allow-Origin':origin,'Access-Control-Allow-Headers':'authorization, apikey, content-type, x-client-info','Access-Control-Allow-Methods':'POST, OPTIONS'});
 const reply=(status:number,body:unknown)=>new Response(JSON.stringify(body),{status,headers});
 if(origin&&!allowedOrigins.has(origin))return reply(403,{error:'Deze website heeft geen toegang.'});
 if(req.method==='OPTIONS')return new Response(null,{status:204,headers});
 if(req.method!=='POST')return reply(405,{error:'Alleen POST is toegestaan.'});
 if(Number(req.headers.get('content-length')||0)>8192)return reply(413,{error:'Aanvraag te groot.'});
 const url=Deno.env.get('SUPABASE_URL'),serviceKey=Deno.env.get('SUPABASE_SERVICE_ROLE_KEY'),publicKey=Deno.env.get('SUPABASE_ANON_KEY');
 if(!url||!serviceKey||!publicKey)return reply(503,{error:'Accountbeheer is nog niet aangesloten.'});
 const token=req.headers.get('authorization')?.replace(/^Bearer\s+/i,'');
 if(!token)return reply(401,{error:'Log opnieuw in.'});
 const admin=createClient(url,serviceKey,{auth:{persistSession:false,autoRefreshToken:false}});
 const {data:{user},error:authError}=await admin.auth.getUser(token);
 if(authError||!user)return reply(401,{error:'Log opnieuw in.'});
 const {data:actor,error:profileError}=await admin.from('learning_profiles').select('user_id,role,username,active,session_valid_after').eq('user_id',user.id).single();
 let iat=0;try{iat=Number(JSON.parse(atob(token.split('.')[1].replace(/-/g,'+').replace(/_/g,'/'))).iat)||0;}catch{return reply(401,{error:'Log opnieuw in.'});}
 if(profileError||!actor?.active||iat*1000<new Date(actor.session_valid_after).getTime())return reply(403,{error:'Je account of sessie is niet actief. Log opnieuw in.'});
 let body;try{const raw=await req.text();if(raw.length>8192)return reply(413,{error:'Aanvraag te groot.'});body=JSON.parse(raw);}catch{return reply(400,{error:'Ongeldige aanvraag.'});}
 if(!body||typeof body!=='object')return reply(400,{error:'Ongeldige aanvraag.'});
 const password=body.password;
 if(typeof password!=='string'||password.length<10||password.length>128)return reply(400,{error:'Gebruik een wachtwoord van 10 tot 128 tekens.'});
 const invalidate=async(id:string)=>{
  const cutoff=new Date((Math.floor(Date.now()/1000)+1)*1000).toISOString();
  const {error}=await admin.from('learning_profiles').update({session_valid_after:cutoff}).eq('user_id',id);
  if(error)throw new Error('account_update_failed');
 };
 try{
  if(body.action==='change_own_password'){
   if(typeof body.current_password!=='string'||body.current_password.length>128)return reply(400,{error:'Vul je huidige wachtwoord in.'});
   const verifier=createClient(url,publicKey,{auth:{persistSession:false,autoRefreshToken:false}});
   const verified=await verifier.auth.signInWithPassword({email:user.email!,password:body.current_password});
   if(verified.error)return reply(403,{error:'Je huidige wachtwoord klopt niet.'});
   try{
    await invalidate(user.id);
    const {error}=await admin.auth.admin.updateUserById(user.id,{password});
    if(error)throw new Error('password_update_failed');
   }finally{await verifier.auth.signOut({scope:'local'});}
   return reply(200,{success:true,reauthenticate:true});
  }
  if(actor.role!=='teacher')return reply(403,{error:'Alleen docenten kunnen accounts beheren.'});
  if(body.action==='create_student'){
   const username=typeof body.username==='string'?body.username.trim().toLowerCase():'';
   const displayName=typeof body.display_name==='string'?body.display_name.trim():'';
   const className=typeof body.class_name==='string'?body.class_name.trim():'';
   if(!/^[a-z0-9][a-z0-9._-]{2,31}$/.test(username)||!displayName||displayName.length>60||className.length>40)return reply(400,{error:'Controleer de leerlingnaam, weergavenaam en klas.'});
   const {data,error}=await admin.auth.admin.createUser({email:username+'@accounts.eatw.invalid',password,email_confirm:true,app_metadata:{eatw_managed:true}});
   if(error||!data.user)return reply(409,{error:'Deze leerlingnaam bestaat al of het account kon niet worden aangemaakt.'});
   const {error:insertError}=await admin.from('learning_profiles').insert({user_id:data.user.id,username,display_name:displayName,class_name:className,role:'student'});
   if(insertError){await admin.auth.admin.deleteUser(data.user.id);return reply(500,{error:'Account aanmaken is niet gelukt. Probeer opnieuw.'});}
   return reply(201,{success:true,user_id:data.user.id,username});
  }
  if(body.action==='reset_student_password'){
   if(typeof body.user_id!=='string'||!/^[-a-f0-9]{36}$/i.test(body.user_id))return reply(400,{error:'Kies een leerling.'});
   const {data:student}=await admin.from('learning_profiles').select('user_id,role').eq('user_id',body.user_id).single();
   if(!student||student.role!=='student')return reply(403,{error:'Alleen leerlingaccounts kunnen hier worden hersteld.'});
   await invalidate(student.user_id);
   const {error}=await admin.auth.admin.updateUserById(student.user_id,{password});
   if(error)throw new Error('password_update_failed');
   return reply(200,{success:true,reauthenticate:true});
  }
  return reply(400,{error:'Onbekende accountactie.'});
 }catch{return reply(500,{error:'De accountactie is niet gelukt. Probeer opnieuw of neem contact op met de beheerder.'});}
});

