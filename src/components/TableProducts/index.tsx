import { Spin, Tooltip } from 'antd';
import { cn } from 'utils';
import React, { ReactNode } from 'react';
import { NO_INDEX_SELECTED, ROW_HEIGHT } from '../../global/constants';

type Column = {
	name: string | ReactNode;
	width?: string;
	rightAligned?: boolean;
	tooltip?: string;
	loading?: boolean;
	alignment?: string;
};

type Props = {
	activeRow?: number;
	columns: Column[];
	data: any;
	loading?: boolean;
	onClick: (index: number) => void;
};

export const TableProducts = ({
	activeRow = NO_INDEX_SELECTED,
	columns,
	data,
	loading = false,
	onClick,
}: Props) => {
	// METHODS
	const getStyleAlignment = (alignment) =>
		({
			textAlign: alignment || 'left',
		}) as React.CSSProperties;

	return (
		<Spin spinning={loading}>
			<div className="relative flex h-full max-h-[635px] min-h-[480px] w-full items-center justify-center overflow-y-auto rounded-lg border-2 border-solid border-gray">
				{!data.length && (
					<img
						alt="logo"
						className="z-1 absolute w-1/2 opacity-20"
						src={require('../../assets/images/logo.png')}
					/>
				)}

				<table className="w-full self-start">
					<thead>
						<tr>
							{columns.map(
								({ name, width, alignment, tooltip = null }, index) => (
									<th
										key={`th-${index}`}
										className="sticky top-0 bg-background px-4 py-6 text-base font-bold text-dark"
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
								className={cn(
									'cursor-pointer border-0 border-b border-solid border-gray',
									{ 'bg-[#20bf6b33]': activeRow === rowIndex },
								)}
								style={{ height: `${ROW_HEIGHT}px` }}
								onClick={() => onClick(rowIndex)}
							>
								{row.map((item, colIndex) => (
									<td
										key={`td-${colIndex}`}
										className="px-4 py-2 text-base font-semibold text-darkGray"
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
