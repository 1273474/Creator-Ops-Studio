import { create } from 'zustand';
import api from '../api/axios';

const useStore = create((set, get) => ({
    user: null,
    deals: [],
    isLoading: false,
    error: null,

    setUser: (user) => set({ user }),

    fetchDeals: async () => {
        set({ isLoading: true });
        try {
            const res = await api.get('/deals');
            set({ deals: res.data, isLoading: false });
        } catch (err) {
            set({ error: err.message, isLoading: false });
        }
    },

    updateDealStatus: async (dealId, newStatus) => {
        // Optimistic update
        const currentDeals = get().deals;
        const updatedDeals = currentDeals.map(deal =>
            deal._id === dealId ? { ...deal, status: newStatus } : deal
        );
        set({ deals: updatedDeals });

        try {
            await api.patch(`/deals/${dealId}/status`, { status: newStatus });
        } catch (err) {
            // Revert on error
            set({ deals: currentDeals, error: "Failed to update status" });
            console.error(err);
        }
    },

    addDeal: (deal) => set((state) => ({ deals: [deal, ...state.deals] })),

    createDeal: async (dealData) => {
        set({ isLoading: true });
        try {
            const res = await api.post('/deals', dealData);
            set((state) => ({
                deals: [res.data, ...state.deals],
                isLoading: false
            }));
            return res.data;
        } catch (err) {
            set({ error: err.message, isLoading: false });
            throw err;
        }
    },
}));

export default useStore;
