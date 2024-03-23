import create from 'zustand';

type Store = {
	weight: number;
	setWeight: (newWeight: number) => void;
	resetWeight: () => void;
};

export const useWeightStore = create<Store>((set) => ({
	weight: 0,
	setWeight: (newWeight) => set({ weight: newWeight }),
	resetWeight: () => set({ weight: 0 }),
}));
