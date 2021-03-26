import { ExclamationCircleOutlined } from '@ant-design/icons';
import { Divider, Modal } from 'antd';
import React from 'react';
import { useCurrentTransaction } from '../../../../hooks/useCurrentTransaction';
import { MainButton } from './MainButton';
import './style.scss';

export const MainButtons = ({ onOpenDrawerModal, onOpenCheckoutModal }) => {
	// CUSTOM HOOKS
	const { transactionProducts, resetTransaction } = useCurrentTransaction();

	// METHODS
	const onResetConfirmation = () => {
		Modal.confirm({
			title: 'Reset Confirmation',
			icon: <ExclamationCircleOutlined />,
			content: 'Are you sure you want to reset and clear the product list?',
			okText: 'Reset',
			cancelText: 'Cancel',
			onOk: resetTransaction,
		});
	};

	return (
		<div className="MainButtons">
			<div className="buttons-wrapper">
				<MainButton
					title="Reset"
					onClick={onResetConfirmation}
					disabled={!transactionProducts.length}
				/>

				<div className="divider">
					<Divider type="vertical" className="vertical-divider" />
				</div>

				<MainButton
					title="Disc 1"
					onClick={onOpenDrawerModal}
					// disabled={!transactionProducts.length}
				/>

				<MainButton
					title="Disc 2"
					onClick={onOpenDrawerModal}
					// disabled={!transactionProducts.length}
				/>

				<div className="divider">
					<Divider type="vertical" className="vertical-divider" />
				</div>

				<MainButton
					title="Checkout"
					onClick={onOpenCheckoutModal}
					disabled={!transactionProducts.length}
				/>
			</div>
		</div>
	);
};
