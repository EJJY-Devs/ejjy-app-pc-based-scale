import { createAction } from 'redux-actions';

export const key = 'BRANCH_PRODUCTS';

export const types = {
	LIST_BRANCH_PRODUCTS: `${key}/LIST_BRANCH_PRODUCTS`,
};

export const actions = {
	listBranchProducts: createAction(types.LIST_BRANCH_PRODUCTS),
};
