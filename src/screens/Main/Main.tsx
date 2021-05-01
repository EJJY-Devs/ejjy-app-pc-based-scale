/* eslint-disable react-hooks/exhaustive-deps */
import { message } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { Container } from '../../components';
import { request } from '../../global/types';
import { useBranchProducts } from '../../hooks/useBranchProducts';
import { usePc } from '../../hooks/usePc';
import { CheckoutModal } from './components/Checkout/CheckoutModal';
import { TemporaryCheckoutModal } from './components/Checkout/TemporaryCheckoutModal';
import { MainButtons } from './components/MainButtons/MainButtons';
import { ProductTable } from './components/ProductTable/ProductTable';
import { SettingUrlModal } from './components/SettingUrl/SettingUrlModal';
import { WeightDrawer } from './components/WeightDrawer/WeightDrawer';
import './style.scss';

const DRAWER_CLOSE_TIME = 4000;

const Main = () => {
	// STATES
	const [checkoutModalVisible, setCheckoutModalVisible] = useState(false);
	const [temporaryCheckoutModalVisible, setTemporaryCheckoutModalVisible] = useState(false);
	const [drawerVisible, setDrawerVisible] = useState(false);
	const [urlModalVisible, setUrlModalVisible] = useState(false);

	// CUSTOM HOOKS
	const { weight, resetWeight, getWeight } = usePc();
	const { listBranchProducts, status } = useBranchProducts();

	// REFS
	const refDrawerTimeout = useRef(null);

	// METHODS
	useEffect(() => {
		resetWeight();
		getWeight();
		listBranchProducts(({ status }) => {
			if (status === request.ERROR) {
				message.error('An error occurred while fetching branch products');
			}
		});
	}, []);

	useEffect(() => {
		if (weight > 0) {
			setDrawerVisible(true);
			clearTimeout(refDrawerTimeout.current);
		} else {
			refDrawerTimeout.current = setTimeout(() => {
				setDrawerVisible(false);
			}, DRAWER_CLOSE_TIME);
		}
	}, [weight]);

	return (
		<Container loading={status === request.REQUESTING}>
			<section className="Main">
				<div className="main-content">
					<ProductTable isLoading={false} />
					<MainButtons
						onOpenCheckoutModal={() => setCheckoutModalVisible(true)}
						onOpenTemporaryCheckoutModal={() => setTemporaryCheckoutModalVisible(true)}
					/>
					<WeightDrawer visible={drawerVisible} onClose={() => setDrawerVisible(false)} />
				</div>

				<CheckoutModal
					visible={checkoutModalVisible}
					onClose={() => setCheckoutModalVisible(false)}
				/>

				<TemporaryCheckoutModal
					visible={temporaryCheckoutModalVisible}
					onClose={() => setTemporaryCheckoutModalVisible(false)}
				/>

				<SettingUrlModal visible={urlModalVisible} onClose={() => setUrlModalVisible(false)} />

				<div className="footer">
					<h2 className="set-url" onClick={() => setUrlModalVisible(true)}>
						Set Local URL
					</h2>
					<h1 className="store-title" onClick={() => setDrawerVisible(true)}>
						EJ &amp; JY WET MARKET AND ENTERPRISES
					</h1>
				</div>
			</section>
		</Container>
	);
};

export default Main;
