import { connectRouter } from 'connected-react-router';
import { combineReducers } from 'redux';
import storage from 'redux-persist/lib/storage';
import { APP_KEY } from '../global/constants';
import history from '../utils/history';
import authReducer, { key as AUTH_KEY } from './auth';
import branchMachinesReducer, { key as BRANCH_MACHINES_KEY } from './branch-machines';
import branchProductsReducer, { key as BRANCH_PRODUCTS_KEY } from './branch-products';
import currentTransactionReducer, { key as CURRENT_TRANSACTION_KEY } from './current-transaction';
import pcReducer, { key as PC_KEY } from './pc';
import requestReducer, { REQUEST_KEY } from './request';
import sessionsReducer, { key as SESSION_KEY, types } from './sessions';
import siteSettingsReducer, { key as SITE_SETTINGS_KEY } from './site-settings';
import uiReducer, { key as UI_KEY } from './ui';

const appReducer = combineReducers({
	router: connectRouter(history),
	[AUTH_KEY]: authReducer,
	[BRANCH_MACHINES_KEY]: branchMachinesReducer,
	[BRANCH_PRODUCTS_KEY]: branchProductsReducer,
	[CURRENT_TRANSACTION_KEY]: currentTransactionReducer,
	[PC_KEY]: pcReducer,
	[REQUEST_KEY]: requestReducer,
	[SESSION_KEY]: sessionsReducer,
	[SITE_SETTINGS_KEY]: siteSettingsReducer,
	[UI_KEY]: uiReducer,
});

const RESET_TYPES = [types.INVALID_SESSION, types.END_SESSION];
export default (state, action) => {
	if (RESET_TYPES.includes(action.type)) {
		storage.removeItem(APP_KEY);
		state = undefined;
	}
	return appReducer(state, action);
};
