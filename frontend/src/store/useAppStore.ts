import { create } from "zustand";

interface AppState {
  lang: "ar" | "en";
  setLang: (lang: "ar" | "en") => void;
  dirtyCount: number;
  setDirtyCount: (n: number) => void;
  pendingValues: Record<string, string>;
  setPendingValues: (v: Record<string, string>) => void;
  updatePendingValue: (key: string, value: string) => void;
  resetPendingValues: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  lang: "ar",
  setLang: (lang) => set({ lang }),
  dirtyCount: 0,
  setDirtyCount: (dirtyCount) => set({ dirtyCount }),
  pendingValues: {},
  setPendingValues: (pendingValues) =>
    set({ pendingValues, dirtyCount: Object.keys(pendingValues).length }),
  updatePendingValue: (key, value) =>
    set((state) => {
      const next = { ...state.pendingValues, [key]: value };
      return { pendingValues: next, dirtyCount: Object.keys(next).length };
    }),
  resetPendingValues: () => set({ pendingValues: {}, dirtyCount: 0 }),
}));
