/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react/jsx-one-expression-per-line */
import { Button, message, Spin } from 'antd';
import { Container } from 'components';
import { AppSettingsModal } from 'components/AppSettings/AppSettingsModal';
import { request } from 'global';
import { useNetwork } from 'hooks';
import { useAuth } from 'hooks/useAuth';
import { useBranchProducts } from 'hooks/useBranchProducts';
import { useCurrentTransaction } from 'hooks/useCurrentTransaction';
import { useProductCategories } from 'hooks/useProductCategories';
import { isEqual } from 'lodash';
import React, { useEffect, useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { getBranchServerUrl } from 'utils/function';
import { Buttons } from './components/Buttons/Buttons';
import { CheckoutModal } from './components/Checkout/CheckoutModal';
import { TemporaryCheckoutModal } from './components/Checkout/TemporaryCheckoutModal';
import { MainTable } from './components/MainTable/MainTable';
import { WeightDrawer } from './components/WeightDrawer/WeightDrawer';
import './style.scss';

const NETWORK_RETRY = 10;
const NETWORK_RETRY_DELAY_MS = 1000;

const Main = () => {
	// STATES
	const [checkoutModalVisible, setCheckoutModalVisible] = useState(false);
	const [temporaryCheckoutModalVisible, setTemporaryCheckoutModalVisible] =
		useState(false);
	const [appSettingsModalVisible, setAppSettingsModalVisible] = useState(false);
	const [branchProducts, setBranchProducts] = useState([]);
	const [isInitialFetch, setIsInitialFetch] = useState(true);

	// VARIABLES
	const branchServerURL = getBranchServerUrl();

	// REFS
	const intervalRef = useRef(null);

	// CUSTOM HOOKS
	const history = useHistory();

	const { user } = useAuth();
	const { isFetching: isConnectingNetwork, isSuccess: isNetworkSuccess } =
		useNetwork({
			options: {
				enabled: !!branchServerURL,
				retry: NETWORK_RETRY,
				retryDelay: NETWORK_RETRY_DELAY_MS,
				onError: () => {
					history.push({
						pathname: 'error',
						state: true,
					});
				},
			},
		});
	const { listBranchProducts, status: branchProductsStatus } =
		useBranchProducts();
	const { listProductCategories, status: productCategoriesStatus } =
		useProductCategories();
	const { currentProduct, setCurrentProduct } = useCurrentTransaction();

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
		if (isNetworkSuccess) {
			const fetchBranchProducts = () => {
				listBranchProducts({}, ({ status, data }) => {
					if (status === request.SUCCESS) {
						setBranchProducts(data);
					} else if (status === request.ERROR) {
						message.error('An error occurred while fetching branch products.');
					}

					if (
						[request.SUCCESS, request.ERROR].includes(status) &&
						isInitialFetch
					) {
						setIsInitialFetch(false);
					}
				});
			};

			fetchBranchProducts();
			intervalRef.current = setInterval(() => {
				fetchBranchProducts();
			}, 60000);

			listProductCategories(({ status }) => {
				if (status === request.ERROR) {
					message.error('An error occurred while fetching product categories.');
				}
			});
		}

		return () => {
			clearInterval(intervalRef.current);
		};
	}, [isNetworkSuccess]);

	useEffect(() => {
		if (currentProduct) {
			const branchProduct = branchProducts.find(
				({ product }) => product.id === currentProduct.id,
			);

			if (branchProduct) {
				const newProduct = {
					...currentProduct,
					...branchProduct.product,
					markdown_price_per_piece1: branchProduct.markdown_price_per_piece1,
					markdown_price_per_piece2: branchProduct.markdown_price_per_piece2,

					// We need to retain the current price_per_piece value if
					// user applied discount
					price_per_piece:
						currentProduct?.discount > 0
							? currentProduct.price_per_piece
							: branchProduct.price_per_piece,
				};

				if (!isEqual(currentProduct, newProduct)) {
					setCurrentProduct(newProduct);
				}
			}
		}
	}, [branchProducts]);

	// NOTE: Temporarily disable the login screen
	// useEffect(() => {
	// 	if (isEmpty(user)) {
	// 		history.replace('/');
	// 	}
	// }, [user]);

	const isLoading =
		(isInitialFetch && branchProductsStatus === request.REQUESTING) ||
		productCategoriesStatus === request.REQUESTING;

	if (isConnectingNetwork) {
		return (
			<Spin
				className="NetworkSpinner"
				size="large"
				tip="Connecting to server..."
				spinning
			/>
		);
	}

	return (
		<Container loading={isLoading} loadingText="Fetching products...">
			<section className="Main">
				<div className="Main_left">
					<MainTable />
					<Buttons
						onOpenCheckoutModal={() => setCheckoutModalVisible(true)}
						onOpenTemporaryCheckoutModal={() => {
							setTemporaryCheckoutModalVisible(true);
						}}
					/>
				</div>

				<div className="Main_right">
					<WeightDrawer branchProducts={branchProducts} />
				</div>
			</section>

			<div className="Footer">
				<Button
					className="Footer_setUrl"
					size="large"
					type="link"
					onClick={() => setAppSettingsModalVisible(true)}
				>
					Set App Settings
				</Button>
				<h1 className="Footer_storeTitle">
					EJ &amp; JY WET MARKET AND ENTERPRISES
				</h1>
			</div>

			<CheckoutModal
				visible={checkoutModalVisible}
				onClose={() => setCheckoutModalVisible(false)}
			/>

			<TemporaryCheckoutModal
				visible={temporaryCheckoutModalVisible}
				onClose={() => setTemporaryCheckoutModalVisible(false)}
			/>

			{appSettingsModalVisible && (
				<AppSettingsModal onClose={() => setAppSettingsModalVisible(false)} />
			)}
		</Container>
	);
};

export default Main;
