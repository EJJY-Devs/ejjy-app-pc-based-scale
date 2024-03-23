import { LoadingOutlined } from '@ant-design/icons';
import { Spin, Tooltip } from 'antd';
import { cn } from 'utils';
import * as React from 'react';

const loadingIcon = (
	<LoadingOutlined style={{ fontSize: 24, color: 'white' }} spin />
);

type Props = {
	icon: React.ReactElement;
	tooltip: string;
	loading?: boolean;
	disabled?: boolean;
	className?: string;
	onClick: () => void;
};

export const ButtonIcon = ({
	onClick,
	icon,
	tooltip,
	loading,
	disabled,
	className,
}: Props) => (
	<Tooltip placement="top" title={tooltip}>
		<button
			className={cn(
				'block flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border border-solid border-gray bg-white p-0',
				className,
				{
					'pointer-events-none !border-0 bg-darkGray opacity-50 !shadow-none':
						disabled,
					'pointer-events-none opacity-80': loading,
				},
			)}
			tabIndex={-1}
			type="button"
			onClick={onClick}
		>
			{loading ? <Spin indicator={loadingIcon} /> : <>{icon}</>}
		</button>
	</Tooltip>
);
