import { create } from 'zustand';
const useRsvpStore = create((set) => ({
  guests: [],
  addGuest: (guest) => set((state) => ({
    guests: [...state.guests, { ...guest, id: Date.now(), submittedAt: new Date().toISOString() }]
  })),
}));
export default useRsvpStore;