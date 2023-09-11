let users = [] as any[];
export const addUser = (id: any) => {
  users.push(id);
};
export const getUser = () => {
  return users;
};
export const getUserCount = (): any => {
  return users.length;
};
export const deleteUser=(id:any)=>{
let index=users.findIndex((userId)=>userId==id)
if (index!=-1) {
  users.splice(index,1)
}
}
