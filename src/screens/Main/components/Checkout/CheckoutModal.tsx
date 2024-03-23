import { Modal } from 'antd';
import { Button, ControlledInput, Label } from 'components/elements';
import { formatNumberWithCommas, standardRound } from 'ejjy-global';
import React, { useCallback, useEffect, useRef } from 'react';
import { useCurrentTransactionStore } from 'stores';

type Props = {
	visible: boolean;
	onClose: () => void;
};

export const CheckoutModal = ({ visible, onClose }: Props) => {
	// STATES
	const inputRef = useRef(null);

	// CUSTOM HOOKS
	const { transactionProducts, resetTransaction } =
		useCurrentTransactionStore();

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

		return formatNumberWithCommas(standardRound(total));
	}, [transactionProducts]);

	const handleSubmit = () => {
		resetTransaction();
		onClose();
	};

	return (
		<Modal
			footer={null}
			title="Checkout"
			visible={visible}
			centered
			closable
			onCancel={onClose}
		>
			<Label className="text-xl" label="Amount Due (₱)" spacing />
			<ControlledInput
				className="text-center text-7xl font-bold text-dark"
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
					onClick={handleSubmit}
				/>
			</div>
		</Modal>
	);
};
