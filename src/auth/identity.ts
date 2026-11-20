export const USERNAME_PATTERN=/^[a-z0-9][a-z0-9._-]{2,31}$/;
export function loginEmail(value:string){
 const name=value.trim().toLowerCase();
 if(name.includes('@')){
  if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(name)||name.length>254)throw new Error('Enter a valid email address.');
  return name;
 }
 return usernameToEmail(name);
}
export function usernameToEmail(username:string){const name=username.trim().toLowerCase();if(!USERNAME_PATTERN.test(name))throw new Error('Use 3–32 letters, numbers, dots, hyphens or underscores.');return name+'@accounts.eatw.invalid';}

