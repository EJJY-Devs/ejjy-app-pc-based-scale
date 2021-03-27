/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { Container } from '../../components';
import { request } from '../../global/types';
import { useBranchProducts } from '../../hooks/useBranchProducts';
import { usePc } from '../../hooks/usePc';
import { PaymentModal } from './components/Checkout/PaymentModal';
import { MainButtons } from './components/MainButtons/MainButtons';
import { ProductTable } from './components/ProductTable/ProductTable';
import { WeightDrawer } from './components/WeightDrawer/WeightDrawer';
import './style.scss';

const Main = () => {
	// STATES
	const [paymentModalVisible, setPaymentModalVisible] = useState(false);
	const [drawerVisible, setDrawerVisible] = useState(false);

	// CUSTOM HOOKS
	const { weight, getWeight } = usePc();
	const { listBranchProducts, status } = useBranchProducts();

	// METHODS
	useEffect(() => {
		// getWeight();
		listBranchProducts();
	}, []);

	useEffect(() => {
		setDrawerVisible(weight > 0);
	}, [weight]);

	return (
		<Container loading={status === request.REQUESTING}>
			<section className="Main">
				<div className="main-content">
					<ProductTable isLoading={false} />
					<MainButtons
						onOpenDrawerModal={() => setDrawerVisible(true)}
						onOpenCheckoutModal={() => setPaymentModalVisible(true)}
					/>
					<WeightDrawer visible={drawerVisible} onClose={() => setDrawerVisible(false)} />
				</div>

				<PaymentModal visible={paymentModalVisible} onClose={() => setPaymentModalVisible(false)} />

				<h1 className="store-title">EJ &amp; JY WET MARKET AND ENTERPRISES</h1>
			</section>
		</Container>
	);
};

export default Main;
