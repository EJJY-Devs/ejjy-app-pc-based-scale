import { createAction, handleActions } from 'redux-actions';
import { createSelector } from 'reselect';

export const key = 'PC';

export const types = {
	SAVE: `${key}/SAVE`,
	GET_WEIGHT: `${key}/GET_WEIGHT`,
	PRINT_PRODUCT: `${key}/PRINT_PRODUCT`,
};

const initialState = {
	weight: 0,
};

const reducer = handleActions(
	{
		[types.SAVE]: (state, { payload }: any) => {
			const { type } = payload;
			let newData = {};

			switch (type) {
				case types.GET_WEIGHT: {
					newData = { weight: payload.weight };
					break;
				}
			}

			return { ...state, ...newData };
		},
	},
	initialState,
);

export const actions = {
	save: createAction(types.SAVE),
	getWeight: createAction(types.GET_WEIGHT),
	printProduct: createAction(types.PRINT_PRODUCT),
};

const selectState = (state: any) => state[key] || initialState;
export const selectors = {
	selectWeight: () => createSelector(selectState, (state) => state.weight),
};

export default reducer;
