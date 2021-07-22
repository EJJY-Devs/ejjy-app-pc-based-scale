/* eslint-disable react/jsx-wrap-multilines */
import { Divider, Table, Tabs } from 'antd';
import { ColumnsType } from 'antd/lib/table/interface';
import { startCase, toLower } from 'lodash';
import React, { useEffect, useState } from 'react';
import { ScaleButton } from '../../../../components';
import { ButtonIcon } from '../../../../components/elements';
import { productCategoryTypes } from '../../../../global/types';
import { useBranchProducts } from '../../../../hooks/useBranchProducts';
import { useCurrentTransaction } from '../../../../hooks/useCurrentTransaction';
import { usePc } from '../../../../hooks/usePc';
import './style.scss';
import { WeightTextcodeModal } from './WeightTextcodeModal';

const columns: ColumnsType = [
	{
		title: 'Description',
		dataIndex: 'description',
		key: 'description',
		width: 350,
	},
	{
		title: 'Action',
		dataIndex: 'action',
		key: 'action',
	},
];

interface Props {
	onSelectProduct: any;
}

export const WeightProductSelection = ({ onSelectProduct }: Props) => {
	// STATES
	const [textcodeModalVisible, setTextcodeModalVisible] = useState(false);
	const [baboyDataSource, setBaboyDataSource] = useState([]);
	const [manokDataSource, setManokDataSource] = useState([]);
	const [gulayDataSource, setGulayDataSource] = useState([]);
	const [hotdogDataSource, setHotdogDataSource] = useState([]);
	const [assortedDataSource, setAssortedDataSource] = useState([]);

	// CUSTOM HOOKS
	const { weight } = usePc();
	const { branchProducts } = useBranchProducts();
	const { transactionProducts } = useCurrentTransaction();

	// METHODS
	useEffect(() => {
		const addedProductIds = transactionProducts.map(({ id }) => id);
		const availableProducts = branchProducts.filter(
			({ product }) => !addedProductIds.includes(product.id),
		);

		// Filter baboy
		setBaboyDataSource(
			getProductsByCategory(availableProducts, productCategoryTypes.BABOY),
		);

		// Filter manok
		setManokDataSource(
			getProductsByCategory(availableProducts, productCategoryTypes.MANOK),
		);

		// Filter gulay
		setGulayDataSource(
			getProductsByCategory(availableProducts, productCategoryTypes.GULAY),
		);

		// Filter hotdog
		setHotdogDataSource(
			getProductsByCategory(availableProducts, productCategoryTypes.HOTDOG),
		);

		// Filter assorted
		setAssortedDataSource(
			getProductsByCategory(availableProducts, productCategoryTypes.ASSORTED),
		);
	}, [branchProducts, transactionProducts]);

	const getProductsByCategory = (products, category) =>
		products
			.filter(({ product }) => product?.product_category === category)
			.map(
				({
					product,
					discounted_price_per_piece1,
					discounted_price_per_piece2,
					price_per_piece,
				}) => ({
					description: product.name,
					action: (
						<ButtonIcon
							icon={
								<img
									src={require('../../../../assets/images/icon-add.svg')}
									alt="icon"
								/>
							}
							tooltip="Add"
							onClick={() => {
								onSelectProduct({
									...product,
									discounted_price_per_piece1,
									discounted_price_per_piece2,
									price_per_piece,
								});
							}}
						/>
					),
				}),
			);

	return (
		<>
			<div className="WeightProductSelection">
				<Divider />

				<Tabs
					className="WeightProductSelection_tabs"
					defaultActiveKey={productCategoryTypes.BABOY}
					type="card"
				>
					<Tabs.TabPane
						key={productCategoryTypes.BABOY}
						tab={startCase(toLower(productCategoryTypes.BABOY))}
					>
						<Table
							columns={columns}
							dataSource={baboyDataSource}
							scroll={{ y: 285 }}
							pagination={false}
						/>
					</Tabs.TabPane>

					<Tabs.TabPane
						key={productCategoryTypes.MANOK}
						tab={startCase(toLower(productCategoryTypes.MANOK))}
					>
						<Table
							columns={columns}
							dataSource={manokDataSource}
							scroll={{ y: 285 }}
							pagination={false}
						/>
					</Tabs.TabPane>

					<Tabs.TabPane
						key={productCategoryTypes.GULAY}
						tab={startCase(toLower(productCategoryTypes.GULAY))}
					>
						<Table
							columns={columns}
							dataSource={gulayDataSource}
							scroll={{ y: 285 }}
							pagination={false}
						/>
					</Tabs.TabPane>

					<Tabs.TabPane
						key={productCategoryTypes.HOTDOG}
						tab={startCase(toLower(productCategoryTypes.HOTDOG))}
					>
						<Table
							columns={columns}
							dataSource={hotdogDataSource}
							scroll={{ y: 285 }}
							pagination={false}
						/>
					</Tabs.TabPane>

					<Tabs.TabPane
						key={productCategoryTypes.ASSORTED}
						tab={startCase(toLower(productCategoryTypes.ASSORTED))}
					>
						<Table
							columns={columns}
							dataSource={assortedDataSource}
							scroll={{ y: 285 }}
							pagination={false}
						/>
					</Tabs.TabPane>
				</Tabs>

				<Divider />

				<ScaleButton
					className="WeightProductSelection_btnInputTextcode"
					title="Input Textcode"
					onClick={() => setTextcodeModalVisible(true)}
					disabled={weight === 0}
				/>
			</div>

			<WeightTextcodeModal
				visible={textcodeModalVisible}
				onSelectProduct={onSelectProduct}
				onClose={() => setTextcodeModalVisible(false)}
			/>
		</>
	);
};
