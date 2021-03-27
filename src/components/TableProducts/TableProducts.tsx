import { Spin, Tooltip } from 'antd';
import cn from 'classnames';
import React, { ReactNode } from 'react';
import { NO_INDEX_SELECTED, ROW_HEIGHT } from '../../global/constants';
import { calculateTableHeight } from '../../utils/function';
import './style.scss';

interface Column {
	name: string | ReactNode;
	width?: string;
	rightAligned?: boolean;
	tooltip?: string;
	loading?: boolean;
	alignment?: string;
}

interface Props {
	columns: Column[];
	data: any;
	activeRow?: number;
	onClick: any;
	loading?: any;
}

export const TableProducts = ({ columns, data, activeRow, onClick, loading }: Props) => {
	// METHODS
	const getStyleAlignment = (alignment) =>
		({
			textAlign: alignment || 'left',
		} as React.CSSProperties);

	return (
		<Spin size="large" spinning={loading}>
			<div
				className="TableProducts"
				style={{ height: calculateTableHeight(data?.length + 1) + 25 }}
			>
				{!data.length && (
					<img src={require('../../assets/images/logo.jpg')} alt="logo" className="placeholder" />
				)}

				<table>
					<thead>
						<tr>
							{columns.map(({ name, width, alignment, tooltip = null }, index) => (
								<th key={`th-${index}`} style={{ width, ...getStyleAlignment(alignment) }}>
									{tooltip ? <Tooltip title={tooltip}>{name}</Tooltip> : name}
								</th>
							))}
						</tr>
					</thead>
					<tbody>
						{data?.map((row, index) => (
							<tr
								className={cn({
									active: activeRow === index,
								})}
								key={`tr-${index}`}
								style={{ height: `${ROW_HEIGHT}px` }}
								onClick={() => onClick(index)}
							>
								{row.map((item, index) => (
									<td key={`td-${index}`} style={getStyleAlignment(columns?.[index]?.alignment)}>
										{item}
									</td>
								))}
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</Spin>
	);
};

TableProducts.defaultProps = {
	activeRow: NO_INDEX_SELECTED,
};
