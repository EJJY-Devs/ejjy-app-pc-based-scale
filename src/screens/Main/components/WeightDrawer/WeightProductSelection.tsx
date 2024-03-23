import { PlusOutlined } from '@ant-design/icons';
import { Divider, Spin, Table, Tabs } from 'antd';
import { ColumnsType } from 'antd/lib/table/interface';
import { LamasAmountModal, ScaleButton, WeightTextcodeModal } from 'components';
import { ButtonIcon, ControlledInput, Label } from 'components/elements';
import {
	BranchProduct,
	convertIntoArray,
	formatDateTime,
	RequestErrors,
	useProductCategories,
	useSiteSettings,
} from 'ejjy-global';
import React, { useEffect, useState } from 'react';
import { useCurrentTransactionStore, useWeightStore } from 'stores';
import { formatWeight } from 'utils/function';

const columns: ColumnsType = [
	{
		title: 'Description',
		dataIndex: 'description',
		width: 350,
	},
	{
		title: 'Action',
		dataIndex: 'action',
	},
];

type Props = {
	branchProducts: BranchProduct[];
	onSelectProduct: (product: BranchProduct) => void;
};

export const WeightProductSelection = ({
	branchProducts,
	onSelectProduct,
}: Props) => {
	// STATES
	const [textcodeModalVisible, setTextcodeModalVisible] = useState(false);
	const [lamasAmountModalVisible, setLamasAmountModalVisible] = useState(false);
	const [dataSource, setDataSource] = useState([]);

	// CUSTOM HOOKS
	const { weight } = useWeightStore();
	const { transactionProducts } = useCurrentTransactionStore();
	const { data: siteSettings } = useSiteSettings();
	const {
		data: productCategoriesData,
		isFetching: isFetchingProductCategories,
		error: productCategoriesError,
	} = useProductCategories({
		options: { refetchOnMount: false },
	});

	// METHODS
	useEffect(() => {
		if (productCategoriesData?.list) {
			const addedProductIds = transactionProducts.map(({ id }) => id);
			const availableProducts = branchProducts.filter(
				({ product }) => !addedProductIds.includes(product.id),
			);

			setDataSource(
				productCategoriesData.list
					.map((productCategory) => ({
						id: productCategory.id,
						title: productCategory.name,
						dataSource: getProductsByCategory(
							availableProducts,
							productCategory.name,
						),
					}))
					.filter(({ dataSource: data }) => data.length > 0),
			);
		}
	}, [branchProducts, transactionProducts, productCategoriesData?.list]);

	const getProductsByCategory = (
		availableBranchProducts: BranchProduct[],
		category: string,
	) =>
		availableBranchProducts
			.filter(({ product }) => product?.product_category === category)
			.map((branchProduct) => {
				const {
					product,
					price_markdown,
					markdown_price_per_piece1,
					markdown_price_per_piece2,
					price_per_piece,
				} = branchProduct;

				return {
					id: branchProduct.id,
					description: product.name,
					action: (
						<ButtonIcon
							icon={<PlusOutlined className="text-lg !text-green-400" />}
							tooltip="Add"
							onClick={() => {
								onSelectProduct({
									...branchProduct,
									markdown_price_per_piece1,
									markdown_price_per_piece2,
									price_per_piece,
									price_markdown,
								});
							}}
						/>
					),
				};
			});

	return (
		<Spin
			spinning={isFetchingProductCategories}
			tip="Fetching product categories..."
		>
			<RequestErrors errors={convertIntoArray(productCategoriesError)} />
			<div className="flex h-full flex-1 flex-col">
				<Label id="weight" label="Weight" spacing />
				<ControlledInput
					className="mb-4 text-[2.5rem] font-bold text-dark"
					value={formatWeight(weight)}
					disabled
					onChange={() => null}
				/>

				{siteSettings?.datetime_last_updated_products && (
					<p className="mb-4 text-center text-sm text-secondary">
						Product last updated:{' '}
						<b>{formatDateTime(siteSettings.datetime_last_updated_products)}</b>
					</p>
				)}

				<Tabs className="flex-1" type="card">
					{dataSource.map((data) => (
						<Tabs.TabPane key={data.id} tab={data.title}>
							<Table
								columns={columns}
								dataSource={data.dataSource}
								pagination={false}
								rowKey="id"
								scroll={{ y: 285 }}
							/>
						</Tabs.TabPane>
					))}
				</Tabs>

				<Divider />

				<div className="grid grid-cols-12 gap-x-4">
					<ScaleButton
						className="col-span-8 h-button"
						disabled={weight === 0}
						title="Input Textcode"
						onClick={() => setTextcodeModalVisible(true)}
					/>

					<ScaleButton
						className="col-span-4 h-button"
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
		</Spin>
	);
};
