/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react/jsx-one-expression-per-line */
import { message } from 'antd';
import { isEmpty } from 'lodash';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Container } from '../../components';
import { request } from '../../global/types';
import { useAuth } from '../../hooks/useAuth';
import { useBranchProducts } from '../../hooks/useBranchProducts';
import { useProductCategories } from '../../hooks/useProductCategories';
import { Buttons } from './components/Buttons/Buttons';
import { CheckoutModal } from './components/Checkout/CheckoutModal';
import { TemporaryCheckoutModal } from './components/Checkout/TemporaryCheckoutModal';
import { MainTable } from './components/MainTable/MainTable';
import { SettingUrlModal } from './components/SettingUrl/SettingUrlModal';
import { WeightDrawer } from './components/WeightDrawer/WeightDrawer';
import './style.scss';

const Main = () => {
	// STATES
	const [checkoutModalVisible, setCheckoutModalVisible] = useState(false);
	const [temporaryCheckoutModalVisible, setTemporaryCheckoutModalVisible] =
		useState(false);
	const [urlModalVisible, setUrlModalVisible] = useState(false);

	// CUSTOM HOOKS
	const history = useHistory();
	const { user } = useAuth();
	const { listBranchProducts, status: branchProductsStatus } =
		useBranchProducts();
	const { listProductCategories, status: productCategoriesStatus } =
		useProductCategories();

	// METHODS
	useEffect(() => {
		listBranchProducts({}, ({ status }) => {
			if (status === request.ERROR) {
				message.error('An error occurred while fetching branch products.');
			}
		});

		listProductCategories(({ status }) => {
			if (status === request.SUCCESS) {
				message.error('An error occurred while fetching product categories.');
			}
		});
	}, []);

	useEffect(() => {
		if (isEmpty(user)) {
			history.replace('/');
		}
	}, [user]);

	return (
		<Container
			loadingText="Fetching products..."
			loading={[branchProductsStatus, productCategoriesStatus].includes(
				request.REQUESTING,
			)}
		>
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
					<WeightDrawer />
				</div>
			</section>

			<div className="Footer">
				<h2 className="Footer_setUrl" onClick={() => setUrlModalVisible(true)}>
					Set Local URL
				</h2>
				<h1 className="Footer_storeTitle">
					EJ &amp; JY WET MARKET AND ENTERPRISES
				</h1>
			</div>

			<span className="AppVersion">
				App Version {process.env.REACT_APP_VERSION}
			</span>

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
