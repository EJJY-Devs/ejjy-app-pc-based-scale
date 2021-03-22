/* eslint-disable react-hooks/exhaustive-deps */
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { Modal, Tooltip } from 'antd';
import React, { useEffect, useState } from 'react';
import KeyboardEventHandler from 'react-keyboard-event-handler';
import { CancelButtonIcon, TableProducts } from '../../../../components';
import { NO_INDEX_SELECTED, PRODUCT_LENGTH_PER_PAGE } from '../../../../global/constants';
import {
	deleteItemShortcutKeys,
	discountItemShortcutKeys,
	editQuantityShortcutKeys,
} from '../../../../global/options';
import {
	productNavigation,
	request,
	transactionStatusTypes,
	vatTypes,
} from '../../../../global/types';
import { useBranchProducts } from '../../../../hooks/useBranchProducts';
import { useCurrentTransaction } from '../../../../hooks/useCurrentTransaction';
import { getProductQuantity, numberWithCommas } from '../../../../utils/function';
import { DiscountModal } from './DiscountModal';
import { EditProductModal } from './EditProductModal';
import './style.scss';

const columns = [
	{ name: '', width: '1px' },
	{ name: 'Item', width: '40%' },
	{ name: 'Qty', width: '15%', alignment: 'center' },
	{ name: 'Rate', width: '15%', alignment: 'end' },
	{ name: 'Amount', alignment: 'end' },
];

const uneditableStatus = [transactionStatusTypes.FULLY_PAID, transactionStatusTypes.VOID_EDITED];

export const editTypes = {
	ADD: 1,
	DEDUCT: 2,
};

interface Props {
	isLoading: boolean;
}

export const ProductTable = ({ isLoading }: Props) => {
	const {
		transactionId,
		transactionProducts,
		pageNumber,
		transactionStatus: currentTransactionStatus,
		navigateProduct,
		removeProduct,
		setCurrentTransaction,
	} = useCurrentTransaction();
	const { branchProducts } = useBranchProducts();

	const [selectedProductIndex, setSelectedProductIndex] = useState(0);
	const [selectedDiscountProduct, setSelectedDiscountProduct] = useState(null);
	const [editProductModalVisible, setEditProductModalVisible] = useState(false);
	const [discountModalVisible, setDiscountModalVisible] = useState(false);
	const [data, setData] = useState([]);

	return (
		<div className="ProductTable">
			{/* <TableProducts
				columns={columns}
				data={data}
				activeRow={selectedProductIndex}
				onHover={onHover}
				onExit={onExit}
				loading={status === request.REQUESTING || isLoading}
			/> */}

			{/* <EditProductModal
				product={transactionProducts?.[selectedProductIndex]}
				visible={editProductModalVisible}
				onClose={() => setEditProductModalVisible(false)}
			/>

			<DiscountModal
				product={selectedDiscountProduct}
				visible={discountModalVisible}
				onClose={() => setDiscountModalVisible(false)}
			/> */}
		</div>
	);
};
