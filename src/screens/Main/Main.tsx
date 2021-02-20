/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from 'react';
import { Container } from '../../components';
import { PaymentModal } from './components/Checkout/PaymentModal';
import { MainButtons } from './components/MainButtons/MainButtons';
import { ProductTable } from './components/ProductTable/ProductTable';
import { WeightDrawer } from './components/WeightDrawer/WeightDrawer';
import './style.scss';

const Main = () => {
	// STATES
	const [paymentModalVisible, setPaymentModalVisible] = useState(false);
	const [drawerVisible, setDrawerVisible] = useState(false);

	return (
		<Container>
			<section className="Main">
				<div className="main-content">
					<ProductTable isLoading={false} />
					<MainButtons
						onOpenDrawerModal={() => setDrawerVisible(true)}
						onOpenCheckoutModal={() => setPaymentModalVisible(true)}
					/>
					<WeightDrawer visible={drawerVisible} onClose={() => setDrawerVisible(false)} />
				</div>

				<PaymentModal
					amountDue="9999"
					visible={paymentModalVisible}
					onSuccess={null}
					onClose={() => setPaymentModalVisible(false)}
				/>

				<h1 className="store-title">EJ &amp; JY WET MARKET AND ENTERPRISES</h1>
			</section>
		</Container>
	);
};

export default Main;
