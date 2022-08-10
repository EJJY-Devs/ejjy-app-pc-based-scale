import { ShoppingCartOutlined } from '@ant-design/icons';
import { Tooltip } from 'antd';
import _ from 'lodash';
import React from 'react';
import { formatInPeso } from 'utils/function';
import './style.scss';

interface Props {
	product: any;
}

export const MainTableName = ({ product }: Props) => {
	const { weight, price_per_piece, discount } = product;
	const price = formatInPeso(price_per_piece);
	const productDiscount =
		discount > 0 ? (
			<span className="MainTableName_quantities_discount">
				{`(${formatInPeso(product.price_per_piece + product.discount)})`}
			</span>
		) : null;

	return (
		<div className="MainTableName">
			<div className="MainTableName_info">
				<span>{product.name}</span>

				{product?.isCheckedOut && (
					<Tooltip title="Item already checked out">
						<ShoppingCartOutlined className="MainTableName_info_icon" />
					</Tooltip>
				)}
			</div>

			<div className="MainTableName_quantities">
				{`${_.round(weight, 3)} x ${price}`}
				{productDiscount}
			</div>
		</div>
	);
};
