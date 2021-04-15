import { all } from 'redux-saga/effects';
import authSagas from './auth';
import branchMachinesSagas from './branch-machines';
import branchProductsSagas from './branch-products';
import pcSagas from './pc';
import sessionsSagas from './session';
import siteSettingsSagas from './site-settings';
import transactionsSagas from './transactions';

export default function* rootSaga() {
	yield all([
		...authSagas,
		...branchMachinesSagas,
		...branchProductsSagas,
		...pcSagas,
		...sessionsSagas,
		...siteSettingsSagas,
		...transactionsSagas,
	]);
}
