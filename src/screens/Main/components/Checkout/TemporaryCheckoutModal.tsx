import { message, Modal, Spin } from 'antd';
import { Button, ControlledInput, Label } from 'components/elements';
import { productCategoryTypes, request } from 'global';
import {
	useAuth,
	useCurrentTransaction,
	usePrintTransaction,
	useTransactions,
} from 'hooks';
import React, { useCallback, useEffect, useRef } from 'react';
import {
	formatPrintDetails,
	formatZeroToO,
	getBranchName,
	getCompanyName,
	numberWithCommas,
	standardRound,
} from 'utils/function';
import './style.scss';

interface Props {
	visible: boolean;
	onClose: any;
}

export const TemporaryCheckoutModal = ({ visible, onClose }: Props) => {
	// STATES
	const inputRef = useRef(null);

	// CUSTOM HOOKS
	const { user } = useAuth();
	const { mutateAsync: printTransaction, isLoading: isPrintingTransaction } =
		usePrintTransaction();
	const { transactionProducts, editProduct } = useCurrentTransaction();
	const { createTransaction, status: transactionStatus } = useTransactions();

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
				(product) =>
					!product.isCheckedOut &&
					product.product_category === productCategoryTypes.GULAY,
			),
		[transactionProducts],
	);

	const getTotal = useCallback(() => {
		const total = getCheckoutProducts().reduce(
			(prev: number, { weight, price_per_piece }) =>
				Number(weight) * Number(price_per_piece) + prev,
			0,
		);

		return numberWithCommas(standardRound(total));
	}, [getCheckoutProducts]);

	const updateCheckedOutProducts = () => {
		getCheckoutProducts().forEach((product) => {
			editProduct({
				id: product.id,
				isCheckedOut: true,
			});
		});
	};

	const onSubmit = () => {
		createTransaction(
			{
				branchMachineId: null,
				tellerId: user?.id, // TODO: Temporarily added a guard since login page is temporarily disabled
				products: getCheckoutProducts().map((product) => ({
					product_id: product.id,
					quantity: Number(product.weight),
					price_per_piece: product.price_per_piece,
					discount_per_piece: product?.discount || 0,
				})),
			},
			({ status: createTransactionStatus, response }) => {
				if (createTransactionStatus === request.SUCCESS) {
					const total = getCheckoutProducts().reduce(
						(prev: number, { weight, price_per_piece }) =>
							Number(weight) * Number(price_per_piece) + prev,
						0,
					);

					printTransaction({
						branchName: formatPrintDetails(getBranchName()),
						companyName: formatPrintDetails(getCompanyName()),
						totalPrice: `P${formatZeroToO(standardRound(total))}`,
						transactionId: `T_${response.id}`,
					})
						.then(() => {
							updateCheckedOutProducts();
							onClose();
							message.success('Transaction was created successfully.');
						})
						.catch(() => {
							message.error('An error occurred while printing transaction.');
						});
				} else if (createTransactionStatus === request.ERROR) {
					message.error('An error occurred while creating transaction.');
				}
			},
		);
	};

	return (
		<Modal
			className="TemporaryCheckoutModal"
			footer={null}
			title="Temporary Checkout"
			visible={visible}
			centered
			closable
			onCancel={onClose}
		>
			<Spin
				spinning={
					[transactionStatus].includes(request.REQUESTING) ||
					isPrintingTransaction
				}
			>
				<div className="form">
					<div className="product-list">
						<Label className="quantity-label" label="Products" spacing />
						<ul>
							{getCheckoutProducts().map(({ name }) => (
								<li key={name}>{name}</li>
							))}
						</ul>
					</div>

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
			</Spin>
		</Modal>
	);
};
