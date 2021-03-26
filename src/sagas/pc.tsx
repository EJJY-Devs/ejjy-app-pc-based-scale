import { call, delay, put, takeLatest } from 'redux-saga/effects';
import { actions, types } from '../ducks/pc';
import { request } from '../global/types';
import { service } from '../services/pc';

const WEIGHT_CHECKING_INTERVAL_MS = 2000;

/* WORKERS */
function* getWeight() {
	try {
		while (true) {
			const response = yield call(service.getWeight);

			yield put(actions.save({ type: types.GET_WEIGHT, weight: response.data.weight }));
			yield delay(WEIGHT_CHECKING_INTERVAL_MS);
		}
	} catch (e) {
		console.error(e);
	}
}

function* printProduct({ payload }: any) {
	const { barcode, weight, callback } = payload;
	callback({ status: request.REQUESTING });

	try {
		yield call(service.printProduct, { barcode, weight });

		callback({ status: request.SUCCESS });
	} catch (e) {
		callback({ status: request.ERROR, errors: e.errors });
	}
}

/* WATCHERS */
const getWeightWatcherSaga = function* getWeightWatcherSaga() {
	yield takeLatest(types.GET_WEIGHT, getWeight);
};

const printProductWatcherSaga = function* printProductWatcherSaga() {
	yield takeLatest(types.PRINT_PRODUCT, printProduct);
};

export default [getWeightWatcherSaga(), printProductWatcherSaga()];
