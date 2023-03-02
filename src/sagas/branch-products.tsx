import { DEFAULT_PAGE, MAX_PAGE_SIZE } from 'global';
import { call, takeLatest } from 'redux-saga/effects';
import { getBranchId } from 'utils/function';
import { types } from '../ducks/branch-products';
import { request } from '../global/types';
import { service } from '../services/branch-products';

/* WORKERS */
function* list({ payload }: any) {
	const { search, callback } = payload;
	callback({ status: request.REQUESTING });

	try {
		const response = yield call(service.list, {
			branch_id: getBranchId(),
			is_shown_in_scale_list: true,
			ordering: '-product__textcode',
			page_size: MAX_PAGE_SIZE,
			page: DEFAULT_PAGE,
			search,
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
