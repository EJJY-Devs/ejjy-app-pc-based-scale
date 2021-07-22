import { ShoppingCartOutlined } from '@ant-design/icons';
import { Tooltip } from 'antd';
import React from 'react';
import { numberWithCommas } from '../../../../utils/function';
import './style.scss';

interface Props {
	product: any;
}

export const MainTableName = ({ product }: Props) => {
	const { weight, price_per_piece, discount } = product;
	const price = `₱${numberWithCommas(price_per_piece.toFixed(2))}`;
	const productDiscount =
		discount > 0 ? (
			<span className="MainTableName_quantities_discount">
				{`(₱${numberWithCommas(
					(product.price_per_piece + product.discount)?.toFixed(2),
				)})`}
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
				{`${weight} x ${price}`}
				{productDiscount}
			</div>
		</div>
	);
};
