/* eslint-disable react-hooks/exhaustive-deps */
import { Divider, Drawer, message, Spin, Tabs } from 'antd';
import { startCase, toLower } from 'lodash';
import React, { useCallback, useEffect, useState } from 'react';
import { AddButtonIcon } from '../../../../components';
import { Label } from '../../../../components/elements';
import ControlledInput from '../../../../components/elements/ControlledInput/ControlledInput';
import { TableNormal } from '../../../../components/TableNormal/TableNormal';
import { productCategoryTypes, request } from '../../../../global/types';
import { useBranchProducts } from '../../../../hooks/useBranchProducts';
import { useCurrentTransaction } from '../../../../hooks/useCurrentTransaction';
import { usePc } from '../../../../hooks/usePc';
import { numberWithCommas } from '../../../../utils/function';
import { MainButton } from '../MainButtons/MainButton';
import './style.scss';
import { TextcodeModal } from './TextcodeModal';

const tabs = {
	BABOY: 'BABOY',
	MANOK: 'MANOK',
	ASSORTED: 'ASSORTED',
};

const columns = [{ name: 'Description' }, { name: 'Action' }];

export const WeightDrawer = ({ visible, onClose }) => {
	// STATES
	const [textcodeModalVisible, setTextcodeModalVisible] = useState(false);
	const [baboyDataSource, setBaboyDataSource] = useState([]);
	const [manokDataSource, setManokDataSource] = useState([]);
	const [assortedDataSource, setAssortedDataSource] = useState([]);

	// CUSTOM HOOKS
	const { weight, printProduct, status } = usePc();
	const { branchProducts } = useBranchProducts();
	const { transactionProducts, addProduct } = useCurrentTransaction();

	// METHODS
	useEffect(() => {
		const addedProductIds = transactionProducts.map(({ id }) => id);
		const availableProducts = branchProducts.filter(
			({ product }) => !addedProductIds.includes(product.id),
		);

		// Filter baboy
		setBaboyDataSource(getProductsByCategory(availableProducts, productCategoryTypes.BABOY));

		// Filter manok
		setManokDataSource(getProductsByCategory(availableProducts, productCategoryTypes.MANOK));

		// Filter assorted
		setAssortedDataSource(getProductsByCategory(availableProducts, productCategoryTypes.ASSORTED));
	}, [branchProducts, transactionProducts]);

	const getTotal = useCallback(
		() =>
			numberWithCommas(
				Object.values(transactionProducts)
					.reduce(
						(prev: number, { weight, price_per_piece }) =>
							Number(weight) * Number(price_per_piece) + prev,
						0,
					)
					.toString(),
			),
		[transactionProducts],
	);

	const onSelectProduct = (product) => {
		const foundProduct = transactionProducts.find(({ id }) => id === product.id);

		if (!foundProduct) {
			printProduct(
				{
					name: product.name?.replace(/\s/g, ''),
					weight: `${weight}kg`,
					price: product.price_per_piece?.toFixed(2),
					totalPrice: '99.99',
					code: product.barcode,
					branch: 'BRANCHNAME',
				},
				({ status }) => {
					if (status === request.SUCCESS) {
						addProduct({ ...product, weight: weight.toFixed(3) });
						onClose();
						message.success('Product successfully added.');
					} else if (status === request.ERROR) {
						message.error('An error occurred while printing receipt.');
					}
				},
			);
		} else {
			message.error('Product already in the list.');
		}
	};

	const getProductsByCategory = (products, category) => {
		return products
			.filter(({ product }) => product?.product_category === category)
			.map(
				({
					product,
					discounted_price_per_piece1,
					discounted_price_per_piece2,
					price_per_piece,
				}) => [
					product.name,
					<AddButtonIcon
						onClick={() =>
							onSelectProduct({
								...product,
								discounted_price_per_piece1: discounted_price_per_piece1,
								discounted_price_per_piece2: discounted_price_per_piece2,
								price_per_piece,
							})
						}
					/>,
				],
			);
	};

	return (
		<Drawer
			className="WeightDrawer"
			visible={visible}
			placement="right"
			width="50%"
			onClose={onClose}
			closable={false}
			maskClosable
		>
			<Spin size="large" spinning={status === request.REQUESTING}>
				<Label id="weight" label="Weight" spacing />
				<ControlledInput
					classNames="input-weight"
					value={weight?.toFixed(3)}
					onChange={() => null}
					disabled
				/>

				<Divider>SELECT PRODUCT</Divider>

				<Tabs defaultActiveKey={tabs.BABOY} type="card">
					<Tabs.TabPane key={tabs.BABOY} tab={startCase(toLower(tabs.BABOY))}>
						<TableNormal columns={columns} data={baboyDataSource} />
					</Tabs.TabPane>

					<Tabs.TabPane key={tabs.MANOK} tab={startCase(toLower(tabs.MANOK))}>
						<TableNormal columns={columns} data={manokDataSource} />
					</Tabs.TabPane>

					<Tabs.TabPane key={tabs.ASSORTED} tab={startCase(toLower(tabs.ASSORTED))}>
						<TableNormal columns={columns} data={assortedDataSource} />
					</Tabs.TabPane>
				</Tabs>

				<Divider>TEXTCODE</Divider>
				<MainButton
					classNames="btn-input-texcode"
					title="Input Textcode"
					onClick={() => setTextcodeModalVisible(true)}
				/>

				<TextcodeModal
					visible={textcodeModalVisible}
					onSelectProduct={onSelectProduct}
					onClose={() => setTextcodeModalVisible(false)}
				/>
			</Spin>
		</Drawer>
	);
};
