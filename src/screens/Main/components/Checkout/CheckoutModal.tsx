import { Modal } from 'antd';
import React, { useCallback, useEffect, useRef } from 'react';
import {
	Button,
	ControlledInput,
	Label,
} from '../../../../components/elements';
import { useCurrentTransaction } from '../../../../hooks/useCurrentTransaction';
import { numberWithCommas, standardRound } from '../../../../utils/function';
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

		return numberWithCommas(standardRound(total));
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
			<div className="form">
				<Label className="quantity-label" label="Amount Due (₱)" spacing />
				<ControlledInput
					className="amount-due-input"
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
						className="btn-cancel"
					/>
					<Button
						type="submit"
						text="Proceed"
						size="lg"
						variant="primary"
						onClick={onSubmit}
					/>
				</div>
			</div>
		</Modal>
	);
};
