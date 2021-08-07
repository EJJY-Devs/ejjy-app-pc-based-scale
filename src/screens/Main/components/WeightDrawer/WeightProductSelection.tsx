/* eslint-disable react/jsx-wrap-multilines */
import { Divider, Table, Tabs } from 'antd';
import { ColumnsType } from 'antd/lib/table/interface';
import React, { useEffect, useState } from 'react';
import { ScaleButton } from '../../../../components';
import { ButtonIcon } from '../../../../components/elements';
import { useBranchProducts } from '../../../../hooks/useBranchProducts';
import { useCurrentTransaction } from '../../../../hooks/useCurrentTransaction';
import { usePc } from '../../../../hooks/usePc';
import { useProductCategories } from '../../../../hooks/useProductCategories';
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
	const [dataSource, setDataSource] = useState([]);

	// CUSTOM HOOKS
	const { weight } = usePc();
	const { branchProducts } = useBranchProducts();
	const { productCategories } = useProductCategories();
	const { transactionProducts } = useCurrentTransaction();

	// METHODS
	useEffect(() => {
		const addedProductIds = transactionProducts.map(({ id }) => id);
		const availableProducts = branchProducts.filter(
			({ product }) => !addedProductIds.includes(product.id),
		);

		setDataSource(
			productCategories
				.map(({ id, name }) => ({
					id,
					title: name,
					dataSource: getProductsByCategory(availableProducts, name),
				}))
				.filter(({ dataSource: data }) => data.length > 0),
		);
	}, [branchProducts, transactionProducts, productCategories]);

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

				<Tabs className="WeightProductSelection_tabs" type="card">
					{dataSource.map((data) => (
						<Tabs.TabPane key={data.id} tab={data.title}>
							<Table
								columns={columns}
								dataSource={data.dataSource}
								scroll={{ y: 285 }}
								pagination={false}
							/>
						</Tabs.TabPane>
					))}
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
