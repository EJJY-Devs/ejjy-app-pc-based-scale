import { all } from 'redux-saga/effects';
import authSagas from './auth';
import branchProductsSagas from './branch-products';
import pcSagas from './pc';
import productCategoriesSagas from './product-categories';
import transactionsSagas from './transactions';

export default function* rootSaga() {
	yield all([
		...authSagas,
		...branchProductsSagas,
		...pcSagas,
		...productCategoriesSagas,
		...transactionsSagas,
	]);
}
