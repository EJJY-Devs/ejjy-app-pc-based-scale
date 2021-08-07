import { createAction, handleActions } from 'redux-actions';
import { createSelector } from 'reselect';

export const key = 'PRODUCT_CATEGORY';

export const types = {
	SAVE: `${key}/SAVE`,
	LIST_PRODUCT_CATEGORIES: `${key}/LIST_PRODUCT_CATEGORIES`,
};

const initialState = {
	productCategories: [],
};

const reducer = handleActions(
	{
		[types.SAVE]: (state, { payload }: any) => ({ ...state, ...payload }),
	},
	initialState,
);

export const actions = {
	save: createAction(types.SAVE),
	listProductCategories: createAction(types.LIST_PRODUCT_CATEGORIES),
};

const selectState = (state: any) => state[key] || initialState;
export const selectors = {
	selectProductCategories: () =>
		createSelector(selectState, (state) => state.productCategories),
};

export default reducer;
