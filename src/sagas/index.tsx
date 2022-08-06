import { all } from 'redux-saga/effects';
import authSagas from './auth';
import branchProductsSagas from './branch-products';
import productCategoriesSagas from './product-categories';
import transactionsSagas from './transactions';

export default function* rootSaga() {
	yield all([
		...authSagas,
		...branchProductsSagas,
		...productCategoriesSagas,
		...transactionsSagas,
	]);
}
