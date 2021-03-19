import { call, delay, put, takeLatest } from 'redux-saga/effects';
import { actions, types } from '../ducks/pc';
import { service } from '../services/pc';

const WEIGHT_CHECKING_INTERVAL_MS = 1000;

/* WORKERS */
function* getWeight() {
	try {
		while (true) {
			const response = yield call(service.getWeight);
			yield put(actions.save({ type: types.GET_WEIGHT, weight: response.data }),);
			yield delay(WEIGHT_CHECKING_INTERVAL_MS);
		}
	} catch (e) {
		console.error(e);
	}
}

/* WATCHERS */
const getWeightWatcherSaga = function* getWeightWatcherSaga() {
	yield takeLatest(types.GET_WEIGHT, getWeight);
};

export default [getWeightWatcherSaga()];
