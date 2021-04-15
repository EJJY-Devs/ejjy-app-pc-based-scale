/* eslint-disable react-hooks/exhaustive-deps */
import { Modal, Spin } from 'antd';
import React, { useCallback, useEffect, useRef } from 'react';
import { Button, ControlledInput, Label } from '../../../../components/elements';
import { useCurrentTransaction } from '../../../../hooks/useCurrentTransaction';
import { numberWithCommas } from '../../../../utils/function';
import './style.scss';

interface Props {
	visible: boolean;
	onClose: any;
}

export const CheckoutModal = ({ visible, onClose }: Props) => {
	// STATES
	const inputRef = useRef(null);

	// CUSTOM HOOKS
	const { transactionProducts, resetTransaction } = useCurrentTransaction();

	// METHODS
	useEffect(() => {
		if (inputRef && inputRef.current) {
			setTimeout(() => {
				const input = inputRef.current;
				input.focus();
			}, 500);
		}
	}, [visible, inputRef]);

	const getTotal = useCallback(() => {
		const total = transactionProducts.reduce(
			(prev: number, { weight, price_per_piece }) =>
				Number(weight) * Number(price_per_piece) + prev,
			0,
		);

		return numberWithCommas(total.toFixed(2));
	}, [transactionProducts]);

	const onSubmit = () => {
		resetTransaction();
		onClose();
	};

	return (
		<Modal
			title="Checkout"
			className="CheckoutModal"
			visible={visible}
			footer={null}
			onCancel={onClose}
			centered
			closable
		>
			<Spin
				size="large"
				spinning={false}
				// spinning={[createTransactionStatus, paymentStatus].includes(request.REQUESTING)}
			>
				<div className="form">
					<Label classNames="quantity-label" label="Amount Due (₱)" spacing />
					<ControlledInput
						classNames="amount-due-input"
						value={getTotal()}
						onChange={() => null}
						disabled
					/>

					<div className="custom-footer">
						<Button
							type="button"
							text="Cancel"
							size="lg"
							onClick={onClose}
							classNames="btn-cancel"
						/>
						<Button type="submit" text="Proceed" size="lg" variant="primary" onClick={onSubmit} />
					</div>
				</div>
			</Spin>
		</Modal>
	);
};
