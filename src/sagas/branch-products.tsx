import { call, takeLatest } from 'redux-saga/effects';
import { types } from '../ducks/branch-products';
import { request } from '../global/types';
import { service } from '../services/branch-products';

/* WORKERS */
function* list({ payload }: any) {
	const { search, callback } = payload;
	callback({ status: request.REQUESTING });

	try {
		const response = yield call(service.list, {
			search,
			is_shown_in_scale_list: true,
			page: 1,
			page_size: 100,
			ordering: '-product__textcode',
		});

		callback({ status: request.SUCCESS, data: response.data.results });
	} catch (e) {
		callback({ status: request.ERROR, errors: e.errors });
	}
}

/* WATCHERS */
const listWatcherSaga = function* listWatcherSaga() {
	yield takeLatest(types.LIST_BRANCH_PRODUCTS, list);
};

export default [listWatcherSaga()];
