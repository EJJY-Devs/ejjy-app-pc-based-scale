/* eslint-disable react-hooks/exhaustive-deps */
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { Divider, Drawer, message, Modal, Spin, Tabs } from 'antd';
import cn from 'classnames';
import { startCase, toLower } from 'lodash';
import React, { useEffect, useState } from 'react';
import { AddButtonIcon } from '../../../../components';
import { Label } from '../../../../components/elements';
import ControlledInput from '../../../../components/elements/ControlledInput/ControlledInput';
import { TableNormal } from '../../../../components/TableNormal/TableNormal';
import { productCategoryTypes, request } from '../../../../global/types';
import { useBranchProducts } from '../../../../hooks/useBranchProducts';
import { useCurrentTransaction } from '../../../../hooks/useCurrentTransaction';
import { usePc } from '../../../../hooks/usePc';
import { numberWithCommas, zeroToO } from '../../../../utils/function';
import { MainButton } from '../MainButtons/MainButton';
import './style.scss';
import { TextcodeModal } from './TextcodeModal';

const tabs = {
	BABOY: 'BABOY',
	MANOK: 'MANOK',
	GULAY: 'GULAY',
	ASSORTED: 'ASSORTED',
};

const columns = [{ name: 'Description' }, { name: 'Action' }];

export const WeightDrawer = ({ visible, onClose }) => {
	// STATES
	const [textcodeModalVisible, setTextcodeModalVisible] = useState(false);
	const [baboyDataSource, setBaboyDataSource] = useState([]);
	const [manokDataSource, setManokDataSource] = useState([]);
	const [gulayDataSource, setGulayDataSource] = useState([]);
	const [assortedDataSource, setAssortedDataSource] = useState([]);

	// CUSTOM HOOKS
	const { weight, printProduct, status } = usePc();
	const { branchProducts } = useBranchProducts();
	const {
		transactionProducts,
		currentProduct,
		setCurrentProduct,
		addProduct,
	} = useCurrentTransaction();

	// METHODS
	useEffect(() => {
		if (weight === 0) {
			setCurrentProduct(null);
		}
	}, [weight]);

	useEffect(() => {
		const addedProductIds = transactionProducts.map(({ id }) => id);
		const availableProducts = branchProducts.filter(
			({ product }) => !addedProductIds.includes(product.id),
		);

		// Filter baboy
		setBaboyDataSource(getProductsByCategory(availableProducts, productCategoryTypes.BABOY));

		// Filter manok
		setManokDataSource(getProductsByCategory(availableProducts, productCategoryTypes.MANOK));

		// Filter gulay
		setGulayDataSource(getProductsByCategory(availableProducts, productCategoryTypes.GULAY));

		// Filter assorted
		setAssortedDataSource(getProductsByCategory(availableProducts, productCategoryTypes.ASSORTED));
	}, [branchProducts, transactionProducts]);

	const onSelectProduct = (product) => {
		const foundProduct = transactionProducts.find(({ id }) => id === product.id);

		if (!foundProduct) {
			setCurrentProduct({ ...product, isCheckedOut: false });
		} else {
			message.error('Product already in the list.');
		}
	};

	const onAddCart = () => {
		addProduct({ ...currentProduct, weight: weight.toFixed(3) });
		onClose();
		message.success('Product successfully added.');
		setCurrentProduct(null);
	};

	const onPrint = () => {
		const weightSplit = weight.toFixed(3).split('.');
		const wholeNumber = `0${weightSplit}`.substring(0, 2);
		const decimalNumber = weightSplit[1].substring(0, 2);

		const total = transactionProducts.reduce(
			(prev: number, { weight, price_per_piece }) =>
				Number(weight) * Number(price_per_piece) + prev,
			0,
		);

		printProduct(
			{
				weight: `${weight.toFixed(3)}kg`,
				price: currentProduct.price_per_piece?.toFixed(2),
				totalPrice: `P${zeroToO(total.toFixed(2))}`,
				code: `${currentProduct.barcode}${wholeNumber}${decimalNumber}`,
				branch: 'TEST',
			},
			({ status }) => {
				if (status === request.SUCCESS) {
					Modal.confirm({
						className: 'EJJYModal',
						title: 'Add To Cart',
						icon: <ExclamationCircleOutlined />,
						content: 'Do you want to add this product to the cart?',
						okText: 'Yes',
						cancelText: 'No',
						onOk: () => {
							addProduct(currentProduct);
							setCurrentProduct(null);
							onClose();
						},
					});

					message.success('Product successfully added.');
				} else if (status === request.ERROR) {
					message.error('An error occurred while printing receipt.');
				}
			},
		);
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
			maskClosable={false}
		>
			<Spin size="large" spinning={status === request.REQUESTING} style={{ height: '100%' }}>
				<div className={cn('drawer-buttons', { 'has-clear-selection': currentProduct })}>
					{currentProduct && (
						<MainButton
							title="CLEAR SELECTION"
							onClick={() => setCurrentProduct(null)}
							classNames="btn-clear-selection"
						/>
					)}

					<MainButton
						title="CLOSE"
						onClick={() => {
							onClose();
							setCurrentProduct(null);
						}}
						classNames="btn-close"
					/>
				</div>

				<Label id="weight" label="Weight" spacing />
				<ControlledInput
					classNames="input-weight"
					value={weight?.toFixed(3)}
					onChange={() => null}
					disabled
				/>

				{currentProduct ? (
					<>
						<div className="input-spacing-top">
							<Label id="name" label="Name" spacing />
							<ControlledInput
								classNames="input-normal"
								value={currentProduct.name}
								onChange={() => null}
								disabled
							/>
						</div>

						<div className="input-spacing-top">
							<Label id="price" label="Price" spacing />
							<ControlledInput
								classNames="input-normal"
								value={`₱${numberWithCommas(currentProduct.price_per_piece?.toFixed(2))}`}
								onChange={() => null}
								disabled
							/>
						</div>

						<div className="input-spacing-top">
							<Label id="total" label="TOTAL" spacing />
							<ControlledInput
								classNames="input-normal"
								value={`₱${numberWithCommas(
									(weight * currentProduct.price_per_piece)?.toFixed(2),
								)}`}
								onChange={() => null}
								disabled
							/>
						</div>

						<div className="button-print-checkout">
							<MainButton classNames="btn-print" title="Print" onClick={onPrint} />
							<MainButton
								classNames="btn-add-cart"
								title={
									<img src={require('../../../../assets/images/icon-add-cart.svg')} alt="icon" />
								}
								onClick={onAddCart}
							/>
						</div>
					</>
				) : (
					<>
						<Divider>SELECT PRODUCT</Divider>

						<Tabs defaultActiveKey={tabs.BABOY} type="card">
							<Tabs.TabPane key={tabs.BABOY} tab={startCase(toLower(tabs.BABOY))}>
								<TableNormal columns={columns} data={baboyDataSource} />
							</Tabs.TabPane>

							<Tabs.TabPane key={tabs.MANOK} tab={startCase(toLower(tabs.MANOK))}>
								<TableNormal columns={columns} data={manokDataSource} />
							</Tabs.TabPane>

							<Tabs.TabPane key={tabs.GULAY} tab={startCase(toLower(tabs.GULAY))}>
								<TableNormal columns={columns} data={gulayDataSource} />
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
					</>
				)}

				<TextcodeModal
					visible={textcodeModalVisible}
					onSelectProduct={onSelectProduct}
					onClose={() => setTextcodeModalVisible(false)}
				/>
			</Spin>
		</Drawer>
	);
};
