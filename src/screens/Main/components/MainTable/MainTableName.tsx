import { ShoppingCartOutlined } from '@ant-design/icons';
import { Tooltip } from 'antd';
import { formatInPeso } from 'ejjy-global';
import React from 'react';
import { ScaleProduct } from 'stores';
import { formatWeight } from 'utils/function';

type Props = {
	scaleProduct: ScaleProduct;
};

export const MainTableName = ({ scaleProduct }: Props) => {
	const { weight, price_per_piece, discount } = scaleProduct;
	const price = formatInPeso(price_per_piece);
	const productDiscount =
		discount > 0 ? (
			<span className="ml-1 text-sm line-through">
				{`(${formatInPeso(scaleProduct.price_per_piece + scaleProduct.discount)})`}
			</span>
		) : null;

	return (
		<>
			<>
				<span>{scaleProduct.product.name}</span>

				{scaleProduct?.isCheckedOut && (
					<Tooltip title="Item already checked out">
						<ShoppingCartOutlined className="ml-2 text-primary" />
					</Tooltip>
				)}
			</>

			<div className="mt-1">
				{`${formatWeight(weight)} x ${price}`}
				{productDiscount}
			</div>
		</>
	);
};
