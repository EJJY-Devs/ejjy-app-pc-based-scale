import { Divider, message, Modal } from 'antd';
import React, { useCallback, useEffect, useRef } from 'react';
import { DetailsRow, DetailsSingle } from '../../../../components';
import { useBranchProducts } from '../../../../hooks/useBranchProducts';
import { useCurrentTransaction } from '../../../../hooks/useCurrentTransaction';
import { EditProductForm } from './EditProductForm';
import './style.scss';

interface Props {
	product: any;
	visible: boolean;
	onClose: any;
}

export const EditProductModal = ({ product, visible, onClose }: Props) => {
	const { branchProducts } = useBranchProducts();

	const { transactionProducts, editProduct } = useCurrentTransaction();

	const inputRef = useRef(null);

	useEffect(() => {
		if (inputRef && inputRef.current) {
			setTimeout(() => {
				const input = inputRef.current;
				input.focus();
			}, 500);
		}
	}, [visible, inputRef]);

	const getMaxQuantity = useCallback(() => {
		if (branchProducts.length && product) {
			const branchProduct = branchProducts.find(
				(bProduct) => bProduct.product?.id === product.productId,
			);

			if (branchProduct) {
				return branchProduct.current_balance;
			}
		}

		return 0;
	}, [branchProducts, product]);

	const onSubmit = (data) => {
		const quantity = data.quantity;

		const callback = () => {
			message.success('Product sucessfully edited.');
			onClose();
		};
	};

	return (
		<Modal
			title="Edit Product"
			className="EditProductModal"
			visible={visible}
			footer={null}
			onCancel={onClose}
			centered
			closable
		>
			<DetailsRow>
				<DetailsSingle
					classNamesLabel="label"
					classNamesValue="value"
					label="Product Name:"
					value={product?.data?.name}
				/>
			</DetailsRow>

			<Divider dashed />

			<EditProductForm
				inputRef={(el) => (inputRef.current = el)}
				maxQuantity={getMaxQuantity()}
				unitOfMeasurementType={product?.data?.unit_of_measurement}
				onSubmit={onSubmit}
				onClose={onClose}
			/>
		</Modal>
	);
};
