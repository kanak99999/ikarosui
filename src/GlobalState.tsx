import { create } from 'zustand';

interface GlobalState{
    menu : any[];
    setMenu : (menu: any[]) => void;
}

export const useStore = create<GlobalState>((set, get) => ({
    menu : [],
    setMenu : (menu) => set({menu})
}));