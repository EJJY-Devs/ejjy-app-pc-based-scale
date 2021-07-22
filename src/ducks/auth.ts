import { createAction, handleActions } from 'redux-actions';
import { createSelector } from 'reselect';

export const key = 'AUTH';

export const types = {
	SAVE: `${key}/SAVE`,
	VALIDATE_USER: `${key}/VALIDATE_USER`,
	LOGIN: `${key}/LOGIN`,
	LOGOUT: `${key}/LOGOUT`,
};

const initialState = {
	user: {},
	accessToken: null,
	refreshToken: null,
	localIpAddress: null,
};

const reducer = handleActions(
	{
		[types.SAVE]: (state, { payload }) => ({
			...state,
			...payload,
		}),
	},
	initialState,
);

export const actions = {
	save: createAction(types.SAVE),
	validateUser: createAction(types.VALIDATE_USER),
	login: createAction(types.LOGIN),
	logout: createAction(types.LOGOUT),
};

const selectState = (state: any) => state[key] || initialState;
export const selectors = {
	selectUser: () => createSelector(selectState, (state) => state.user),
	selectLocalIpAddress: () =>
		createSelector(selectState, (state) => state.localIpAddress),
};

export default reducer;
