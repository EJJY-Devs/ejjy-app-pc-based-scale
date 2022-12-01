import { Divider, Table, Tabs } from 'antd';
import { ColumnsType } from 'antd/lib/table/interface';
import { LamasAmountModal, ScaleButton, WeightTextcodeModal } from 'components';
import { ButtonIcon, ControlledInput, Label } from 'components/elements';
import { useCurrentTransaction, useSiteSettings } from 'hooks';
import { useProductCategories } from 'hooks/useProductCategories';
import React, { useEffect, useState } from 'react';
import { useWeightStore } from 'stores';
import { formatDateTime, formatWeight } from 'utils/function';
import './style.scss';

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
	branchProducts: any;
	onSelectProduct: any;
}

export const WeightProductSelection = ({
	branchProducts,
	onSelectProduct,
}: Props) => {
	// STATES
	const [textcodeModalVisible, setTextcodeModalVisible] = useState(false);
	const [lamasAmountModalVisible, setLamasAmountModalVisible] = useState(false);
	const [dataSource, setDataSource] = useState([]);

	// CUSTOM HOOKS
	const weight = useWeightStore((state: any) => state.weight);
	const { productCategories } = useProductCategories();
	const { transactionProducts } = useCurrentTransaction();
	const { data: siteSettings } = useSiteSettings();

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
					price_markdown,
					markdown_price_per_piece1,
					markdown_price_per_piece2,
					price_per_piece,
				}) => ({
					description: product.name,
					action: (
						<ButtonIcon
							icon={
								<img
									alt="icon"
									src={require('../../../../assets/images/icon-add.svg')}
								/>
							}
							tooltip="Add"
							onClick={() => {
								onSelectProduct({
									...product,
									markdown_price_per_piece1,
									markdown_price_per_piece2,
									price_per_piece,
									price_markdown,
								});
							}}
						/>
					),
				}),
			);

	return (
		<>
			<div className="WeightProductSelection">
				<Label id="weight" label="Weight" spacing />
				<ControlledInput
					className="WeightProductSelection_inputWeight"
					value={formatWeight(weight)}
					disabled
					onChange={() => null}
				/>

				<Divider />

				{siteSettings?.datetime_last_updated_products && (
					<p className="WeightProductSelection_productUpdateInfo">
						Product last updated:{' '}
						<b>{formatDateTime(siteSettings.datetime_last_updated_products)}</b>
					</p>
				)}

				<Tabs className="WeightProductSelection_tabs" type="card">
					{dataSource.map((data) => (
						<Tabs.TabPane key={data.id} tab={data.title}>
							<Table
								columns={columns}
								dataSource={data.dataSource}
								pagination={false}
								scroll={{ y: 285 }}
							/>
						</Tabs.TabPane>
					))}
				</Tabs>

				<Divider />

				<div className="WeightProductSelection_btnWrapper">
					<ScaleButton
						className="WeightProductSelection_btnInputTextcode"
						disabled={weight === 0}
						title="Input Textcode"
						onClick={() => setTextcodeModalVisible(true)}
					/>

					<ScaleButton
						className="WeightProductSelection_btnInputAmount"
						title="Input Amount"
						onClick={() => setLamasAmountModalVisible(true)}
					/>
				</div>
			</div>

			<WeightTextcodeModal
				visible={textcodeModalVisible}
				onClose={() => setTextcodeModalVisible(false)}
				onSelectProduct={onSelectProduct}
			/>

			{lamasAmountModalVisible && (
				<LamasAmountModal onClose={() => setLamasAmountModalVisible(false)} />
			)}
		</>
	);
};
