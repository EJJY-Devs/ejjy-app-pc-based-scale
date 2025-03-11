import { Spin } from 'antd';
import { Container } from 'components';
import {
	convertIntoArray,
	DEFAULT_PAGE,
	MAX_PAGE_SIZE,
	REFETCH_SYNC_INTERVAL_MS,
	RequestErrors,
	useBranchProducts,
	useProductCategories,
} from 'ejjy-global';
import { useNetwork } from 'hooks';
import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useCurrentTransactionStore } from 'stores';
import { getBranchId, getBranchServerUrl } from 'utils/function';
import { Buttons } from './components/Buttons';
import { CheckoutModal } from './components/Checkout/CheckoutModal';
import { TemporaryCheckoutModal } from './components/Checkout/TemporaryCheckoutModal';
import { MainTable } from './components/MainTable';
import { WeightDrawer } from './components/WeightDrawer';

const Main = () => {
	// STATES
	const [checkoutModalVisible, setCheckoutModalVisible] = useState(false);
	const [temporaryCheckoutModalVisible, setTemporaryCheckoutModalVisible] =
		useState(false);

	// VARIABLES
	const branchServerURL = getBranchServerUrl();

	// CUSTOM HOOKS
	const history = useHistory();
	const { currentProduct, setCurrentProduct } = useCurrentTransactionStore();
	const { isFetching: isConnectingNetwork, isSuccess: isNetworkSuccess } =
		useNetwork(branchServerURL);
	const {
		data: branchProductsData,
		isLoading: isLoadingBranchProducts,
		error: branchProductsError,
	} = useBranchProducts({
		params: {
			branchId: Number(getBranchId()),
			isShownInScaleList: true,
			ordering: '-product__textcode',
			page: DEFAULT_PAGE,
			pageSize: MAX_PAGE_SIZE,
		},
		options: {
			enabled: isNetworkSuccess,
			refetchInterval: REFETCH_SYNC_INTERVAL_MS,
		},
	});
	const {
		isFetching: isFetchingProductCategories,
		error: productCategoriesError,
	} = useProductCategories({
		options: { enabled: isNetworkSuccess },
	});

	// METHODS
	useEffect(() => {
		if (!branchServerURL) {
			history.push({
				pathname: 'error',
				state: true,
			});
		}
	}, [branchServerURL]);

	useEffect(() => {
		if (currentProduct && branchProductsData?.list) {
			const branchProduct = branchProductsData?.list.find(
				({ product }) => product?.id === currentProduct?.product?.id,
			);

			if (branchProduct) {
				const newProduct = {
					...currentProduct,
					markdown_price_per_piece1: branchProduct.markdown_price_per_piece1,
					markdown_price_per_piece2: branchProduct.markdown_price_per_piece2,

					// NOTE: We need to retain the current price_per_piece value if
					// user applied discount
					price_per_piece:
						currentProduct?.discount > 0
							? currentProduct.price_per_piece
							: branchProduct.price_per_piece,
				};

				if (!_.isEqual(currentProduct, newProduct)) {
					setCurrentProduct(newProduct);
				}
			}
		}
	}, [currentProduct, branchProductsData?.list]);

	if (isConnectingNetwork) {
		return (
			<Spin
				className="absolute bottom-0 left-0 flex h-full w-full flex-col items-center justify-center gap-4"
				size="large"
				tip="Connecting to server..."
				spinning
			/>
		);
	}

	return (
		<Container loading={isLoadingBranchProducts || isFetchingProductCategories}>
			<RequestErrors
				errors={[
					...convertIntoArray(branchProductsError, 'Branch Products'),
					...convertIntoArray(productCategoriesError, 'Product Categories'),
				]}
			/>

			<section className="grid h-full w-full grid-cols-2 gap-6">
				<div className="flex flex-col">
					<MainTable />
					<Buttons
						onOpenCheckoutModal={() => setCheckoutModalVisible(true)}
						onOpenTemporaryCheckoutModal={() => {
							setTemporaryCheckoutModalVisible(true);
						}}
					/>
				</div>

				<div>
					<WeightDrawer branchProducts={branchProductsData?.list || []} />
				</div>
			</section>

			{checkoutModalVisible && (
				<CheckoutModal onClose={() => setCheckoutModalVisible(false)} />
			)}

			{temporaryCheckoutModalVisible && (
				<TemporaryCheckoutModal
					onClose={() => setTemporaryCheckoutModalVisible(false)}
				/>
			)}
		</Container>
	);
};

export default Main;
