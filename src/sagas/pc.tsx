import { call, delay, put, takeLatest } from 'redux-saga/effects';
import { actions, types } from '../ducks/pc';
import { request } from '../global/types';
import { service } from '../services/pc';

const WEIGHT_CHECKING_INTERVAL_MS = 10;

/* WORKERS */
function* getWeight() {
	try {
		while (true) {
			const response = yield call(service.getWeight);

			yield put(
				actions.save({ type: types.GET_WEIGHT, weight: response.data.weight }),
			);
			yield delay(WEIGHT_CHECKING_INTERVAL_MS);
		}
	} catch (e) {
		// eslint-disable-next-line no-console
		console.error('getWeight', e);
	}
}

function* recalibrate({ payload }: any) {
	const { callback } = payload;
	callback({ status: request.REQUESTING });

	try {
		yield call(service.recalibrate);
		callback({ status: request.SUCCESS });
	} catch (e) {
		callback({ status: request.ERROR, errors: e.errors });
	}
}

function* printProduct({ payload }: any) {
	const { name, weight, price, totalPrice, code, branch, callback } = payload;
	callback({ status: request.REQUESTING });

	try {
		yield call(service.printProduct, {
			name,
			weight,
			price,
			totalPrice,
			code,
			branch,
		});
		callback({ status: request.SUCCESS });
	} catch (e) {
		callback({ status: request.ERROR, errors: e.errors });
	}
}

function* printTransaction({ payload }: any) {
	const { transactionId, totalPrice, branch, callback } = payload;
	callback({ status: request.REQUESTING });

	try {
		yield call(service.printTransaction, { transactionId, totalPrice, branch });
		callback({ status: request.SUCCESS });
	} catch (e) {
		callback({ status: request.ERROR, errors: e.errors });
	}
}

/* WATCHERS */
const getWeightWatcherSaga = function* getWeightWatcherSaga() {
	yield takeLatest(types.GET_WEIGHT, getWeight);
};

const recalibrateWatcherSaga = function* recalibrateWatcherSaga() {
	yield takeLatest(types.RECALIBRATE, recalibrate);
};

const printProductWatcherSaga = function* printProductWatcherSaga() {
	yield takeLatest(types.PRINT_PRODUCT, printProduct);
};

const printTransactionWatcherSaga = function* printTransactionWatcherSaga() {
	yield takeLatest(types.PRINT_TRANSACTION, printTransaction);
};

export default [
	getWeightWatcherSaga(),
	recalibrateWatcherSaga(),
	printProductWatcherSaga(),
	printTransactionWatcherSaga(),
];
