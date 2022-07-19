/* eslint-disable react/jsx-wrap-multilines */
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { Modal } from 'antd';
import React, { useEffect, useState } from 'react';
import { TableProducts } from '../../../../components';
import { ButtonIcon } from '../../../../components/elements';
import { useCurrentTransaction } from '../../../../hooks/useCurrentTransaction';
import { formatInPeso } from '../../../../utils/function';
import { MainTableName } from './MainTableName';
import './style.scss';

const columns = [
	{ name: '', width: '1px' },
	{ name: 'Item', width: '60%' },
	{ name: 'Amount', alignment: 'end' },
];

export const MainTable = () => {
	// STATES
	const [data, setData] = useState([]);

	// CUSTOM HOOKS
	const {
		transactionProducts,
		selectedProductIndex,
		removeProduct,
		setSelectedProduct,
	} = useCurrentTransaction();

	// METHODS
	useEffect(() => {
		const formattedProducts = transactionProducts.map((product) => [
			<ButtonIcon
				key="remove"
				icon={
					<img
						alt="icon"
						src={require('../../../../assets/images/icon-cancel.svg')}
					/>
				}
				tooltip="Remove"
				onClick={() => onRemoveProductConfirmation(product)}
			/>,
			<MainTableName key="table" product={product} />,
			formatInPeso(product.weight * product.price_per_piece),
		]);

		setData(formattedProducts);
	}, [transactionProducts]);

	const onRemoveProductConfirmation = (product) => {
		Modal.confirm({
			className: 'EJJYModal',
			title: 'Delete Confirmation',
			icon: <ExclamationCircleOutlined />,
			content: `Are you sure you want to delete ${product.name}?`,
			okText: 'Delete',
			cancelText: 'Cancel',
			onOk: () => removeProduct(product.id),
		});
	};

	return (
		<div className="MainTable">
			<TableProducts
				activeRow={selectedProductIndex}
				columns={columns}
				data={data}
				onClick={setSelectedProduct}
			/>
		</div>
	);
};
