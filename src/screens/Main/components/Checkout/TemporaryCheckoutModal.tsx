import { message, Modal, Spin } from 'antd';
import React, { useCallback, useEffect, useRef } from 'react';
import { Button, ControlledInput, Label } from '../../../../components/elements';
import { productCategoryTypes, request } from '../../../../global/types';
import { useAuth } from '../../../../hooks/useAuth';
import { useCurrentTransaction } from '../../../../hooks/useCurrentTransaction';
import { usePc } from '../../../../hooks/usePc';
import { useTransactions } from '../../../../hooks/useTransactions';
import { numberWithCommas } from '../../../../utils/function';
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

	const getCheckoutProducts = useCallback(() => {
		return transactionProducts.filter(
			(product) => !product.isCheckedOut && product.product_category === productCategoryTypes.GULAY,
		);
	}, [transactionProducts]);

	const getTotal = useCallback(() => {
		const total = getCheckoutProducts().reduce(
			(prev: number, { weight, price_per_piece }) =>
				Number(weight) * Number(price_per_piece) + prev,
			0,
		);

		return numberWithCommas(total.toFixed(2));
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
			({ status, response }) => {
				if (status === request.SUCCESS) {
					printTransaction(
						{
							id: response.id,
							branch: 'BRANCHNAME',
							totalPrice: getTotal().toFixed(2),
						},
						({ status }) => {
							if (status === request.SUCCESS) {
								updateCheckedOutProducts();
								onClose();
								message.success('Transaction was created successfully.');
							} else if (status === request.ERROR) {
								message.error('An error occurred while printing transaction.');
							}
						},
					);
				} else if (status === request.ERROR) {
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
			<Spin size="large" spinning={[transactionStatus, pcStatus].includes(request.REQUESTING)}>
				<div className="form">
					<div className="product-list">
						<Label classNames="quantity-label" label="Products" spacing />
						<ul>
							{getCheckoutProducts().map(({ name }) => (
								<li>{name}</li>
							))}
						</ul>
					</div>

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
