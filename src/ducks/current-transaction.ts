import { cloneDeep } from 'lodash';
import { createAction, handleActions } from 'redux-actions';
import { createSelector } from 'reselect';
import { NO_INDEX_SELECTED } from '../global/constants';

export const key = 'CURRENT_TRANSACTION';

export const types = {
	SET_SELECTED_PRODUCT: `${key}/SET_SELECTED_PRODUCT`,

	ADD_PRODUCT: `${key}/ADD_PRODUCT`,
	REMOVE_PRODUCT: `${key}/REMOVE_PRODUCT`,
	EDIT_PRODUCT: `${key}/EDIT_PRODUCT`,
	RESET_TRANSACTION: `${key}/RESET_TRANSACTION`,
	SET_DISCOUNT: `${key}/SET_DISCOUNT`,
	SET_CURRENT_PRODUCT: `${key}/SET_CURRENT_PRODUCT`,
};

const initialState = {
	products: [],
	selectedProductIndex: NO_INDEX_SELECTED,
	currentProduct: null,
};

const reducer = handleActions(
	{
		[types.ADD_PRODUCT]: (state, { payload }: any) => ({
			...state,
			products: [payload, ...state.products],
		}),

		[types.REMOVE_PRODUCT]: (state, { payload }: any) => ({
			...state,
			products: state.products.filter(({ id }) => id !== payload),
		}),

		[types.EDIT_PRODUCT]: (state, { payload }: any) => {
			const products = cloneDeep(state.products);
			const index = products.findIndex(({ id }) => id === payload.id);

			if (index >= 0) {
				products[index] = {
					...products[index],
					...payload,
				};
			}

			return { ...state, products };
		},

		[types.SET_DISCOUNT]: (state, { payload }: any) => ({
			...state,
			overallDiscount: payload,
		}),

		[types.SET_SELECTED_PRODUCT]: (state, { payload }: any) => ({
			...state,
			selectedProductIndex:
				state.selectedProductIndex === payload ? NO_INDEX_SELECTED : payload,
		}),

		[types.SET_CURRENT_PRODUCT]: (state, { payload }: any) => ({
			...state,
			currentProduct: payload,
		}),

		[types.RESET_TRANSACTION]: () => initialState,
	},
	initialState,
);

export const actions = {
	addProduct: createAction(types.ADD_PRODUCT),
	removeProduct: createAction(types.REMOVE_PRODUCT),
	editProduct: createAction(types.EDIT_PRODUCT),
	resetTransaction: createAction(types.RESET_TRANSACTION),
	setDiscount: createAction(types.SET_DISCOUNT),

	setSelectedProduct: createAction(types.SET_SELECTED_PRODUCT),
	setCurrentProduct: createAction(types.SET_CURRENT_PRODUCT),
};

const selectState = (state: any) => state[key] || initialState;
export const selectors = {
	selectProducts: () => createSelector(selectState, (state) => state.products),
	selectSelectedProductIndex: () =>
		createSelector(selectState, (state) => state.selectedProductIndex),
	selectCurrentProduct: () =>
		createSelector(selectState, (state) => state.currentProduct),
};

export default reducer;
