import create from 'zustand';

const store = create((set) => ({
	weight: 0,
	setWeight: (newWeight) => set(newWeight),
	resetWeight: () => set({ weight: 0 }),
}));

export default store;
