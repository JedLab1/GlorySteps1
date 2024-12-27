import { create } from "zustand";
const useStore = create((set) => ({
  shouldHideTab: false,
  setShouldHideTab: (visible) => set({ shouldHideTab: visible }),
  showDuolingo:false,
  setShowDuolingo: (visible) => set({ showDuolingo: visible }),
}));

export default useStore;
