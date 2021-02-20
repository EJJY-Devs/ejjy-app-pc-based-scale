import { Spin, Tooltip } from 'antd';
import cn from 'classnames';
import React, { ReactNode } from 'react';
import { ROW_HEIGHT } from '../../global/constants';
import { calculateTableHeight } from '../../utils/function';

import './style.scss';

interface Column {
	name: string | ReactNode;
	width?: string;
	center?: boolean;
	tooltip?: string;
}

interface Props {
	columns: Column[];
	data: any;
	loading?: boolean;
	displayInPage?: boolean;
	hasCustomHeaderComponent?: boolean;
}

export const Table = ({
	columns,
	data,
	loading,
	displayInPage,
	hasCustomHeaderComponent,
}: Props) => {
	return (
		<Spin size="large" spinning={loading}>
			<div
				className={cn('Table', { page: displayInPage, hasCustomHeaderComponent })}
				style={{ height: calculateTableHeight(data?.length + 1) + 25 }}
			>
				<table>
					<thead>
						<tr>
							{columns.map(({ name, width, center = false, tooltip = null }, index) => (
								<th key={`th-${index}`} style={{ width, textAlign: center ? 'center' : 'left' }}>
									{tooltip ? <Tooltip title={tooltip}>{name}</Tooltip> : name}
								</th>
							))}
						</tr>
					</thead>
					<tbody>
						{data?.map((row, index) => (
							<tr key={`tr-${index}`} style={{ height: `${ROW_HEIGHT}px` }}>
								{row.map((item, index) => (
									<td
										key={`td-${index}`}
										style={{ textAlign: columns?.[index].center ? 'center' : 'left' }}
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

Table.defaultProps = {
	loading: false,
	displayInPage: false,
};
