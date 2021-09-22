/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react/jsx-one-expression-per-line */
import { captureMessage } from '@sentry/react';
import { message } from 'antd';
import { isEmpty } from 'lodash';
import React, { useEffect, useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { AppVersion, Container } from '../../components';
import { SettingUrlModal } from '../../components/SettingUrl/SettingUrlModal';
import { request } from '../../global/types';
import { useAuth } from '../../hooks/useAuth';
import { useBranchProducts } from '../../hooks/useBranchProducts';
import { useProductCategories } from '../../hooks/useProductCategories';
import { Buttons } from './components/Buttons/Buttons';
import { CheckoutModal } from './components/Checkout/CheckoutModal';
import { TemporaryCheckoutModal } from './components/Checkout/TemporaryCheckoutModal';
import { MainTable } from './components/MainTable/MainTable';
import { WeightDrawer } from './components/WeightDrawer/WeightDrawer';
import './style.scss';

const Main = () => {
	// STATES
	const [checkoutModalVisible, setCheckoutModalVisible] = useState(false);
	const [temporaryCheckoutModalVisible, setTemporaryCheckoutModalVisible] =
		useState(false);
	const [urlModalVisible, setUrlModalVisible] = useState(false);
	const [branchProducts, setBranchProducts] = useState([]);
	const [isInitialFetch, setIsInitialFetch] = useState(true);

	// REFS
	const intervalRef = useRef(null);

	// CUSTOM HOOKS
	const history = useHistory();
	const { user } = useAuth();
	const { listBranchProducts, status: branchProductsStatus } =
		useBranchProducts();
	const { listProductCategories, status: productCategoriesStatus } =
		useProductCategories();

	// METHODS
	useEffect(() => {
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
		// intervalRef.current = setInterval(() => {
		// 	fetchBranchProducts();
		// }, 10000);

		listProductCategories(({ status }) => {
			if (status === request.ERROR) {
				message.error('An error occurred while fetching product categories.');
			}
		});

		return () => {
			clearInterval(intervalRef.current);
		};
	}, []);

	// NOTE: Temporarily disable updating of branch product per now
	useEffect(() => {
		console.log('Fetched:', branchProducts);
		// if (currentProduct) {
		// 	const branchProduct = branchProducts.find(
		// 		({ product }) => product.id === currentProduct.id,
		// 	);

		// 	if (branchProduct) {
		// 		const newProduct = {
		// 			...currentProduct,
		// 			...branchProduct.product,
		// 			discounted_price_per_piece1:
		// 				branchProduct.discounted_price_per_piece1,
		// 			discounted_price_per_piece2:
		// 				branchProduct.discounted_price_per_piece2,

		// 			// We need to retain the current price_per_piece value if
		// 			// user applied discount
		// 			price_per_piece:
		// 				currentProduct?.discount > 0
		// 					? currentProduct.price_per_piece
		// 					: branchProduct.price_per_piece,
		// 		};

		// 		if (!isEqual(currentProduct, newProduct)) {
		// 			setCurrentProduct(newProduct);
		// 		}
		// 	}
		// }
	}, [branchProducts]);

	useEffect(() => {
		if (isEmpty(user)) {
			history.replace('/');
		}
	}, [user]);

	const isLoading =
		(isInitialFetch && branchProductsStatus === request.REQUESTING) ||
		productCategoriesStatus === request.REQUESTING;

	return (
		<Container loadingText="Fetching products..." loading={isLoading}>
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
				<h2 className="Footer_setUrl" onClick={() => setUrlModalVisible(true)}>
					Set Server URL
				</h2>
				<h1 className="Footer_storeTitle">
					EJ &amp; JY WET MARKET AND ENTERPRISES
				</h1>
			</div>

			<AppVersion />

			<CheckoutModal
				visible={checkoutModalVisible}
				onClose={() => setCheckoutModalVisible(false)}
			/>

			<TemporaryCheckoutModal
				visible={temporaryCheckoutModalVisible}
				onClose={() => setTemporaryCheckoutModalVisible(false)}
			/>

			<SettingUrlModal
				visible={urlModalVisible}
				onClose={() => setUrlModalVisible(false)}
			/>
		</Container>
	);
};

export default Main;
