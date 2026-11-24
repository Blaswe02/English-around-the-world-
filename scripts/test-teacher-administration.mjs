import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import { webcrypto } from 'node:crypto';
import ts from 'typescript';
const source=readFileSync('supabase/functions/manage-learning-accounts/index.ts','utf8').replace(/^import .*?;\n/,'');
const code=ts.transpileModule(source,{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.None}}).outputText;
const actorId='00000000-0000-4000-8000-000000000001',targetId='00000000-0000-4000-8000-000000000002';
async function invoke(body,options={}){
 const calls=[];let handler;
 const actor={user_id:actorId,role:'teacher',active:true,is_admin:false,session_valid_after:'1970-01-01T00:00:00Z',...options.actor};
 const target={user_id:targetId,role:'teacher',active:true,is_admin:false,...options.target};
 const client={auth:{getUser:async()=>({data:{user:options.unauthenticated?null:{id:actorId,email:'admin@example.org'}},error:null}),admin:{
 createUser:async(input)=>{calls.push(['create',input]);return {data:{user:{id:targetId}},error:null};},
 deleteUser:async(id)=>{calls.push(['delete',id]);return {error:null};},
 getUserById:async()=>({data:{user:{email:'teacher@example.org'}},error:null}),
 updateUserById:async(id,input)=>{calls.push(['password',id,input]);return {error:null};}
 }},from:()=>{let selectedId;const chain={select:()=>chain,eq:(key,value)=>{if(key==='user_id')selectedId=value;return chain;},single:async()=>({data:selectedId===actorId?actor:target,error:null}),order:async()=>({data:[target],error:null}),insert:async(input)=>{calls.push(['profile',input]);return {error:options.profileFailure?{message:'failure'}:null};},update:()=>chain};return chain;}};
 const context={Deno:{env:{get:()=> 'configured'},serve:fn=>{handler=fn;}},createClient:()=>client,crypto:webcrypto,Uint8Array,atob,btoa,Response,Request,console};
 vm.runInNewContext(code,context);
 const token='header.'+Buffer.from(JSON.stringify({iat:Math.floor(Date.now()/1000)})).toString('base64url')+'.signature';
 const response=await handler(new Request('https://example.org/accounts',{method:'POST',headers:{authorization:'Bearer '+token,'content-type':'application/json',origin:'https://english-around-the-world.vercel.app'},body:JSON.stringify(body)}));
 return {status:response.status,payload:await response.json(),calls};
}
let cases=0;
for(const action of ['list_teachers','create_teacher','reset_teacher_password']){
 const result=await invoke({action,email:'new@example.org',display_name:'New',user_id:targetId,is_admin:true,role:'admin'});
 assert.equal(result.status,403);assert.equal(result.calls.length,0);cases++;
}
for(const actor of [{role:'student',is_admin:true},{active:false,is_admin:true},{is_admin:true,session_valid_after:'2099-01-01T00:00:00Z'}]){
 const result=await invoke({action:'create_teacher',email:'new@example.org',display_name:'New'},{actor});assert.equal(result.status,403);assert.equal(result.calls.length,0);cases++;
}
let r=await invoke({action:'create_teacher',email:'New@Example.org',display_name:'New teacher',is_admin:true},{actor:{is_admin:true}});
assert.equal(r.status,201);assert.equal(r.payload.email,'new@example.org');assert.ok(r.payload.temporary_password.length>=24);assert.equal(r.calls.find(c=>c[0]==='profile')[1].is_admin,false);assert.equal(r.calls.find(c=>c[0]==='profile')[1].role,'teacher');cases++;
r=await invoke({action:'create_teacher',email:'not-an-email',display_name:'New'},{actor:{is_admin:true}});assert.equal(r.status,400);assert.equal(r.calls.length,0);cases++;
r=await invoke({action:'create_teacher',email:'new@example.org',display_name:'New'},{actor:{is_admin:true},profileFailure:true});assert.equal(r.status,500);assert.equal(r.calls.filter(c=>c[0]==='delete').length,1);cases++;
r=await invoke({action:'list_teachers'},{actor:{is_admin:true}});assert.equal(r.status,200);assert.equal(r.payload.teachers.length,1);cases++;
r=await invoke({action:'reset_teacher_password',user_id:targetId},{actor:{is_admin:true}});assert.equal(r.status,200);assert.equal(r.calls.filter(c=>c[0]==='password').length,1);cases++;
r=await invoke({action:'reset_teacher_password',user_id:targetId},{actor:{is_admin:true},target:{is_admin:true}});assert.equal(r.status,403);assert.equal(r.calls.length,0);cases++;
r=await invoke({action:'reset_teacher_password',user_id:actorId},{actor:{is_admin:true}});assert.equal(r.status,403);assert.equal(r.calls.length,0);cases++;
r=await invoke({action:'create_student',username:'test-student',display_name:'Test',class_name:'1A',password:'test-only-password',study_year:1,study_level:'BASIS'});assert.equal(r.status,201);assert.equal(r.calls.find(c=>c[0]==='profile')[1].role,'student');cases++;
r=await invoke({action:'create_teacher',email:'new@example.org',display_name:'New'},{unauthenticated:true});assert.equal(r.status,401);assert.equal(r.calls.length,0);cases++;
console.log(cases+' account authorization and lifecycle checks passed.');
