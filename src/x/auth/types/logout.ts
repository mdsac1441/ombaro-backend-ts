import { UserRepository } from "../repositories"



export const logout = async ({name,password}:{name:string,password:string})=> {
    const user = await UserRepository;
    if(!user) throw new Error('User not found')
}