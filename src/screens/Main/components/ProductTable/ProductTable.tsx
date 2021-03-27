/* eslint-disable react-hooks/exhaustive-deps */
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { Modal } from 'antd';
import React, { useEffect, useState } from 'react';
import { CancelButtonIcon, TableProducts } from '../../../../components';
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
	const {
		transactionProducts,
		selectedProductIndex,
		editProduct,
		removeProduct,
		setSelectedProduct,
	} = useCurrentTransaction();

	// METHODS
	useEffect(() => {
		console.log('transactionProducts', transactionProducts);
		const formattedProducts = transactionProducts.map((product) => [
			<CancelButtonIcon tooltip="Remove" onClick={() => onRemoveProductConfirmation(product)} />,
			product.name,
			<ControlledInput
				type="number"
				value={product.weight}
				onChange={(value) => onEditProductWeight(product, value)}
			/>,
			product?.discount > 0 ? (
				<div>
					{`₱${numberWithCommas(product.price_per_piece?.toFixed(2))}`}
					<span className="original-price">
						{`₱${numberWithCommas((product.price_per_piece + product.discount)?.toFixed(2))}`}
					</span>
				</div>
			) : (
				`₱${numberWithCommas(product.price_per_piece.toFixed(2))}`
			),
			`₱${numberWithCommas((Number(product.weight) * product.price_per_piece)?.toFixed(3))}`,
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
			<TableProducts
				columns={columns}
				data={data}
				activeRow={selectedProductIndex}
				onClick={setSelectedProduct}
				loading={false}
			/>

			{/* 
			<DiscountModal
				product={selectedDiscountProduct}
				visible={discountModalVisible}
				onClose={() => setDiscountModalVisible(false)}
			/> */}
		</div>
	);
};
