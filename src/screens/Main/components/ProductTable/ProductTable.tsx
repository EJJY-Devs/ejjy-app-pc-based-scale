/* eslint-disable react-hooks/exhaustive-deps */
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { Modal } from 'antd';
import React, { useEffect, useState } from 'react';
import { CancelButtonIcon, Table } from '../../../../components';
import ControlledInput from '../../../../components/elements/ControlledInput/ControlledInput';
import { useCurrentTransaction } from '../../../../hooks/useCurrentTransaction';
import { numberWithCommas } from '../../../../utils/function';
import './style.scss';

const columns = [
	{ name: '', width: '1px' },
	{ name: 'Item', width: '40%' },
	{ name: 'Qty', width: '15%', alignment: 'center' },
	{ name: 'Rate', width: '15%', alignment: 'end' },
	{ name: 'Amount', alignment: 'end' },
];

interface Props {
	isLoading: boolean;
}

export const ProductTable = ({ isLoading }: Props) => {
	// STATES
	const [data, setData] = useState([]);

	// CUSTOM HOOKS
	const { transactionProducts, editProduct, removeProduct } = useCurrentTransaction();

	// METHODS
	useEffect(() => {
		const formattedProducts = transactionProducts.map((product) => [
			<CancelButtonIcon tooltip="Remove" onClick={() => onRemoveProductConfirmation(product)} />,
			product.name,
			<ControlledInput
				type="number"
				value={product.weight}
				onChange={(value) => onEditProductWeight(product, value)}
			/>,
			`₱${numberWithCommas(Number(product.price_per_piece)?.toFixed(2))}`,
			`₱${numberWithCommas((Number(product.weight) * Number(product.price_per_piece)).toFixed(2))}`,
		]);

		setData(formattedProducts);
	}, [transactionProducts]);

	const onRemoveProductConfirmation = (product) => {
		Modal.confirm({
			title: 'Delete Confirmation',
			icon: <ExclamationCircleOutlined />,
			content: `Are you sure you want to delete ${product.name}?`,
			okText: 'Delete',
			cancelText: 'Cancel',
			onOk: () => removeProduct(product.id),
		});
	};

	const onEditProductWeight = (product, weight) => {
		editProduct({
			id: product.id,
			weight,
		});
	};

	return (
		<div className="ProductTable">
			<Table columns={columns} data={data} />

			{/* 
			<DiscountModal
				product={selectedDiscountProduct}
				visible={discountModalVisible}
				onClose={() => setDiscountModalVisible(false)}
			/> */}
		</div>
	);
};
