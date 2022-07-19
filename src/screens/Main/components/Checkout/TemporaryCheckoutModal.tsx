import { message, Modal, Spin } from 'antd';
import React, { useCallback, useEffect, useRef } from 'react';
import {
	Button,
	ControlledInput,
	Label,
} from '../../../../components/elements';
import { productCategoryTypes, request } from '../../../../global/types';
import { useAuth } from '../../../../hooks/useAuth';
import { useCurrentTransaction } from '../../../../hooks/useCurrentTransaction';
import { usePc } from '../../../../hooks/usePc';
import { useTransactions } from '../../../../hooks/useTransactions';
import {
	numberWithCommas,
	standardRound,
	formatZeroToO,
} from '../../../../utils/function';
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
	const { printTransaction, status: pcStatus } = usePc();
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
				tellerId: user.id,
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

					printTransaction(
						{
							transactionId: `T_${response.id}`,
							totalPrice: `P${formatZeroToO(standardRound(total))}`,
							branch: 'TEST',
						},
						({ status: printTransactionStatus }) => {
							if (printTransactionStatus === request.SUCCESS) {
								updateCheckedOutProducts();
								onClose();
								message.success('Transaction was created successfully.');
							} else if (printTransactionStatus === request.ERROR) {
								message.error('An error occurred while printing transaction.');
							}
						},
					);
				} else if (createTransactionStatus === request.ERROR) {
					message.error('An error occurred while creating transaction.');
				}
			},
		);
	};

	return (
		<Modal
			title="Temporary Checkout"
			className="TemporaryCheckoutModal"
			visible={visible}
			footer={null}
			onCancel={onClose}
			centered
			closable
		>
			<Spin
				size="large"
				spinning={[transactionStatus, pcStatus].includes(request.REQUESTING)}
			>
				<div className="form">
					<div className="product-list">
						<Label className="quantity-label" label="Products" spacing />
						<ul>
							{getCheckoutProducts().map(({ name }) => (
								<li>{name}</li>
							))}
						</ul>
					</div>

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
			</Spin>
		</Modal>
	);
};
