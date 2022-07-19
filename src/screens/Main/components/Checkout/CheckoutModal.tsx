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
			className="CheckoutModal"
			footer={null}
			title="Checkout"
			visible={visible}
			centered
			closable
			onCancel={onClose}
		>
			<div className="form">
				<Label className="quantity-label" label="Amount Due (₱)" spacing />
				<ControlledInput
					className="amount-due-input"
					value={getTotal()}
					disabled
					onChange={() => null}
				/>

				<div className="custom-footer">
					<Button
						className="btn-cancel"
						size="lg"
						text="Cancel"
						type="button"
						onClick={onClose}
					/>
					<Button
						size="lg"
						text="Proceed"
						type="submit"
						variant="primary"
						onClick={onSubmit}
					/>
				</div>
			</div>
		</Modal>
	);
};
