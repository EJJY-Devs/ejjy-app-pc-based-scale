import { Modal } from 'antd';
import { Button, ControlledInput, Label } from 'components/elements';
import { formatNumberWithCommas, standardRound } from 'ejjy-global';
import React, { useCallback } from 'react';
import { useCurrentTransactionStore } from 'stores';

type Props = {
	onClose: () => void;
};

export const CheckoutModal = ({ onClose }: Props) => {
	// CUSTOM HOOKS
	const { transactionProducts, resetTransaction } =
		useCurrentTransactionStore();

	// METHODS
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
			centered
			closable
			visible
			onCancel={onClose}
		>
			<Label className="text-xl" label="Amount Due (₱)" spacing />
			<ControlledInput
				className="text-center text-7xl font-bold text-dark"
				value={getTotal()}
				disabled
				onChange={() => null}
			/>

			<div className="mt-8 grid grid-cols-2 gap-x-5">
				<Button size="lg" text="Cancel" type="button" onClick={onClose} />
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
