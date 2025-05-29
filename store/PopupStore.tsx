import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface PopupState {
  activePopup: string | null;
  togglePopup: (id: string | null) => void;
}

export const usePopupStore = create<PopupState>()(
  devtools((set) => ({
    activePopup: null,
    togglePopup: (id) => set(() => ({ activePopup: id })),
  })),
);
