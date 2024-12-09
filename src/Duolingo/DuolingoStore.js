import { create } from "zustand";
const useDuolingoStore = create((set) => ({
  shouldHideKeyboard: true,
  setShouldHideKeyboard: (visible) => set({ shouldHideKeyboard: visible }),
}));

export default useDuolingoStore;
