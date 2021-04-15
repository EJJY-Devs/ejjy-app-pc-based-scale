import { call, takeLatest } from 'redux-saga/effects';
import { types } from '../ducks/transactions';
import { request } from '../global/types';
import { service } from '../services/transactions';

/* WORKERS */
function* create({ payload }: any) {
	const { branchMachineId, tellerId, products, callback } = payload;
	callback({ status: request.REQUESTING });

	try {
		const response = yield call(service.create, {
			branch_machine_id: branchMachineId,
			teller_id: tellerId,
			products,
		});

		callback({ status: request.SUCCESS, response: response.data });
	} catch (e) {
		callback({ status: request.ERROR, errors: e.errors });
	}
}

/* WATCHERS */

const createWatcherSaga = function* createWatcherSaga() {
	yield takeLatest(types.CREATE_TRANSACTION, create);
};
export default [createWatcherSaga()];
