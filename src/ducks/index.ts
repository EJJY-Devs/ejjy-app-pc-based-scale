import { connectRouter } from 'connected-react-router';
import { combineReducers } from 'redux';
import storage from 'redux-persist/lib/storage';
import { APP_KEY } from '../global/constants';
import history from '../utils/history';
import authReducer, { key as AUTH_KEY, types as authTypes } from './auth';
import branchProductsReducer, {
	key as BRANCH_PRODUCTS_KEY,
} from './branch-products';
import currentTransactionReducer, {
	key as CURRENT_TRANSACTION_KEY,
} from './current-transaction';
import pcReducer, { key as PC_KEY } from './pc';

const appReducer = combineReducers({
	router: connectRouter(history),
	[AUTH_KEY]: authReducer,
	[BRANCH_PRODUCTS_KEY]: branchProductsReducer,
	[CURRENT_TRANSACTION_KEY]: currentTransactionReducer,
	[PC_KEY]: pcReducer,
});

export default (state, action) => {
	if (action.type === authTypes.LOGOUT) {
		storage.removeItem(APP_KEY);
		// eslint-disable-next-line no-param-reassign
		state = undefined;
	}
	return appReducer(state, action);
};
