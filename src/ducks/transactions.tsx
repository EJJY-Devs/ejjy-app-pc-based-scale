import { createAction } from 'redux-actions';

export const key = 'TRANSACTIONS';

export const types = {
	CREATE_TRANSACTION: `${key}/CREATE_TRANSACTION`,
};

export const actions = {
	createTransaction: createAction(types.CREATE_TRANSACTION),
};
