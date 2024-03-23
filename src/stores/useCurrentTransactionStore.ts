import { BranchProduct } from 'ejjy-global';
import { NO_INDEX_SELECTED } from 'global';
import create from 'zustand';
import { persist } from 'zustand/middleware';

export interface ScaleProduct extends BranchProduct {
	discount: number;
	weight: number;
	isCheckedOut: boolean;
	markdownType: string;
}

interface State {
	transactionProducts: ScaleProduct[];
	selectedProductIndex: number;
	currentProduct: ScaleProduct;
}

interface Store extends State {
	addProduct: (product: Partial<ScaleProduct>) => void;
	updateProduct: (id: number, data: Partial<ScaleProduct>) => void;
	deleteProduct: (id: number) => void;
	setSelectedProductIndex: (index: number) => void;
	setCurrentProduct: (product: Partial<ScaleProduct>) => void;
	resetTransaction: () => void;
}

const initialState: State = {
	transactionProducts: [],
	currentProduct: null,
	selectedProductIndex: NO_INDEX_SELECTED,
};

export const useCurrentTransactionStore = create(
	persist<Store>(
		(set) => ({
			...initialState,
			addProduct: (product: Partial<ScaleProduct>) => {
				set((state) => ({
					...state,
					transactionProducts: [
						product as ScaleProduct,
						...state.transactionProducts,
					],
				}));
			},
			updateProduct: (id: number, product: Partial<ScaleProduct>) => {
				set((state) => {
					const updatedProducts = state.transactionProducts.map(
						(stateProduct) => {
							if (stateProduct.id === id) {
								return {
									...stateProduct,
									...product,
								};
							}

							return stateProduct;
						},
					);

					return {
						...state,
						transactionProducts: updatedProducts,
					};
				});
			},
			deleteProduct: (id: number) => {
				set((state) => {
					const updatedProducts = state.transactionProducts.filter(
						(stateProduct) => stateProduct.id !== id,
					);

					return {
						...state,
						transactionProducts: updatedProducts,
					};
				});
			},

			setSelectedProductIndex: (index: number) => {
				set((state) => ({
					...state,
					selectedProductIndex:
						state.selectedProductIndex === index ? NO_INDEX_SELECTED : index,
				}));
			},
			setCurrentProduct: (product: Partial<ScaleProduct>) => {
				set((state) => ({
					...state,
					currentProduct: product as ScaleProduct,
				}));
			},

			resetTransaction: () => set(() => initialState),
		}),
		{
			name: 'current-transaction',
			getStorage: () => localStorage,
		},
	),
);
