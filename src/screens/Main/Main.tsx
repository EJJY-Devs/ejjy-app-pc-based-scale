/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react/jsx-one-expression-per-line */
import { message } from 'antd';
import { isEmpty, isEqual } from 'lodash';
import React, { useEffect, useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Container } from '../../components';
import { AppSettingsModal } from '../../components/AppSettings/AppSettingsModal';
import { request } from '../../global/types';
import { useAuth } from '../../hooks/useAuth';
import { useBranchProducts } from '../../hooks/useBranchProducts';
import { useCurrentTransaction } from '../../hooks/useCurrentTransaction';
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
	const [appSettingsModalVisible, setAppSettingsModalVisible] = useState(false);
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
	const { currentProduct, setCurrentProduct } = useCurrentTransaction();

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
				<h2
					className="Footer_setUrl"
					onClick={() => setAppSettingsModalVisible(true)}
				>
					Set Server URL
				</h2>
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
