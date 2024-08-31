import create from 'zustand';

type Store = {
	price: number;
	setPrice: (newPrice: number) => void;
	resetPrice: () => void;
};

export const usePriceStore = create<Store>((set) => ({
	price: 0,
	setPrice: (newPrice) => set({ price: newPrice }),
	resetPrice: () => set({ price: 0 }),
}));
