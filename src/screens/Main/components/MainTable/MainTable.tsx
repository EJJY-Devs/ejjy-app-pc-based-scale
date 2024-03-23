import { CloseOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { Modal } from 'antd';
import { TableProducts } from 'components';
import { ButtonIcon } from 'components/elements';
import { formatInPeso } from 'ejjy-global';
import React, { useEffect, useState } from 'react';
import { ScaleProduct, useCurrentTransactionStore } from 'stores';
import { MainTableName } from './MainTableName';

const columns = [
	{ name: '', width: '1px' },
	{ name: 'Item', width: '60%' },
	{ name: 'Amount', alignment: 'end' },
];

export const MainTable = () => {
	// STATES
	const [dataSource, setDataSource] = useState([]);

	// CUSTOM HOOKS
	const {
		transactionProducts,
		selectedProductIndex,
		deleteProduct,
		setSelectedProductIndex,
	} = useCurrentTransactionStore();

	// METHODS
	useEffect(() => {
		const formattedProducts = transactionProducts.map((scaleProduct) => [
			<ButtonIcon
				key="remove"
				icon={<CloseOutlined className="text-lg !text-red-500" />}
				tooltip="Remove"
				onClick={() => handleDeleteProduct(scaleProduct)}
			/>,
			<MainTableName key="table" scaleProduct={scaleProduct} />,
			formatInPeso(scaleProduct.weight * scaleProduct.price_per_piece),
		]);

		setDataSource(formattedProducts);
	}, [transactionProducts]);

	const handleDeleteProduct = (scaleProduct: ScaleProduct) => {
		Modal.confirm({
			className: 'EJJYModal',
			title: 'Delete Confirmation',
			icon: <ExclamationCircleOutlined />,
			content: `Are you sure you want to delete ${scaleProduct.product.name}?`,
			okText: 'Delete',
			cancelText: 'Cancel',
			onOk: () => deleteProduct(scaleProduct.id),
		});
	};

	return (
		<div className="flex-1 pb-5">
			<TableProducts
				activeRow={selectedProductIndex}
				columns={columns}
				data={dataSource}
				onClick={setSelectedProductIndex}
			/>
		</div>
	);
};
