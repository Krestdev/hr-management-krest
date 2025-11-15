import { Employee } from "@/types/types";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface store {
    user?: Employee;
    token?: string;
    isHydrated:boolean;
}

interface actions {
    logout: ()=>void;
    login: (user:Employee, token:string)=>void;
    setIsHydrated:(v:boolean)=>void;
}

const initialValue:store = {
    user: undefined,
    token: undefined,
    isHydrated: false
}

const useKizunaStore = create<store & actions>()(
    persist(
        (set, get)=>({
            ...initialValue,
            logout: ()=>{set({user:undefined, token:undefined})},
            login: (user, token)=>{set({user:user, token:token})},
            setIsHydrated: (v)=>{set({isHydrated:v})}
        }),
        {
            name: "kizuna-store",
            storage: createJSONStorage(()=>sessionStorage),
            onRehydrateStorage: ()=>(state)=> {
                state?.setIsHydrated(true);//
            }
        }
    )
);

export default useKizunaStore;