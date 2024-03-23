import { message, Modal, Spin } from 'antd';
import { Button, ControlledInput, Label } from 'components/elements';
import {
	formatNumberWithCommas,
	standardRound,
	useTransactionCreate,
} from 'ejjy-global';
import { productCategoryTypes } from 'global';
import { usePrintTransaction } from 'hooks';
import React, { useCallback, useEffect, useRef } from 'react';
import { useCurrentTransactionStore, useUserStore } from 'stores';
import {
	formatPrintDetails,
	formatZeroToO,
	getBranchName,
	getCompanyName,
} from 'utils/function';

type Props = {
	visible: boolean;
	onClose: () => void;
};

export const TemporaryCheckoutModal = ({ visible, onClose }: Props) => {
	// STATES
	const inputRef = useRef<HTMLInputElement | null>(null);

	// CUSTOM HOOKS
	const { user } = useUserStore();
	const { mutateAsync: printTransaction, isLoading: isPrintingTransaction } =
		usePrintTransaction();
	const { transactionProducts, updateProduct } = useCurrentTransactionStore();
	const { mutateAsync: createTransaction, isLoading: isCreatingTransaction } =
		useTransactionCreate();

	// METHODS
	useEffect(() => {
		if (inputRef && inputRef.current) {
			setTimeout(() => {
				const input = inputRef.current;
				input.focus();
			}, 500);
		}
	}, [visible, inputRef]);

	const getCheckoutProducts = useCallback(
		() =>
			transactionProducts.filter(
				(tp) =>
					!tp.isCheckedOut &&
					tp.product.product_category === productCategoryTypes.GULAY,
			),
		[transactionProducts],
	);

	const getTotal = useCallback(() => {
		const total = getCheckoutProducts().reduce(
			(prev: number, { weight, price_per_piece }) =>
				Number(weight) * Number(price_per_piece) + prev,
			0,
		);

		return formatNumberWithCommas(standardRound(total));
	}, [getCheckoutProducts]);

	const updateCheckedOutProducts = () => {
		getCheckoutProducts().forEach((product) => {
			updateProduct(product.id, {
				isCheckedOut: true,
			});
		});
	};

	const handleSubmit = async () => {
		const checkedOutProducts = getCheckoutProducts();
		const { data: transaction } = await createTransaction({
			branchMachineId: null,
			tellerId: user?.id, // TODO: Temporarily added a guard since login page is temporarily disabled
			products: checkedOutProducts.map((product) => ({
				product_id: product.id,
				quantity: Number(product.weight),
				price_per_piece: product.price_per_piece,
				discount_per_piece: product?.discount || 0,
			})),
		});

		const total = checkedOutProducts.reduce(
			(prev: number, { weight, price_per_piece }) =>
				Number(weight) * Number(price_per_piece) + prev,
			0,
		);

		await printTransaction({
			branchName: formatPrintDetails(getBranchName()),
			companyName: formatPrintDetails(getCompanyName()),
			totalPrice: `P${formatZeroToO(standardRound(total))}`,
			transactionId: `T_${transaction.id}`,
		});

		updateCheckedOutProducts();

		onClose();
		message.success('Transaction was created successfully.');
	};

	return (
		<Modal
			footer={null}
			title="Temporary Checkout"
			visible={visible}
			centered
			closable
			onCancel={onClose}
		>
			<Spin spinning={isCreatingTransaction || isPrintingTransaction}>
				<div className="mb-4">
					<Label className="text-xl" label="Products" spacing />
					<ul>
						{getCheckoutProducts().map((tp) => (
							<li key={tp.id} className="text-base text-dark">
								{tp.product.name}
							</li>
						))}
					</ul>
				</div>

				<Label className="text-xl" label="Amount Due (₱)" spacing />
				<ControlledInput
					ref={inputRef}
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
			</Spin>
		</Modal>
	);
};
