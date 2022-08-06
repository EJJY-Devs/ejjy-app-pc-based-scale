import { Spin, Tooltip } from 'antd';
import cn from 'classnames';
import React, { ReactNode } from 'react';
import { NO_INDEX_SELECTED, ROW_HEIGHT } from '../../global/constants';
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
	loading?: boolean;
}

export const TableProducts = ({
	columns,
	data,
	activeRow,
	onClick,
	loading,
}: Props) => {
	// METHODS
	const getStyleAlignment = (alignment) =>
		({
			textAlign: alignment || 'left',
		} as React.CSSProperties);

	return (
		<Spin spinning={loading}>
			<div className="TableProducts">
				{!data.length && (
					<img
						alt="logo"
						className="placeholder"
						src={require('../../assets/images/logo.jpg')}
					/>
				)}

				<table>
					<thead>
						<tr>
							{columns.map(
								({ name, width, alignment, tooltip = null }, index) => (
									<th
										key={`th-${index}`}
										style={{ width, ...getStyleAlignment(alignment) }}
									>
										{tooltip ? <Tooltip title={tooltip}>{name}</Tooltip> : name}
									</th>
								),
							)}
						</tr>
					</thead>
					<tbody>
						{data?.map((row, rowIndex) => (
							<tr
								key={`tr-${rowIndex}`}
								className={cn({
									active: activeRow === rowIndex,
								})}
								style={{ height: `${ROW_HEIGHT}px` }}
								onClick={() => onClick(rowIndex)}
							>
								{row.map((item, colIndex) => (
									<td
										key={`td-${colIndex}`}
										style={getStyleAlignment(columns?.[colIndex]?.alignment)}
									>
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
	loading: false,
};
