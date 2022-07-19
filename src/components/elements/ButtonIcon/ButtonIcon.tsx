import { LoadingOutlined } from '@ant-design/icons';
import { Spin, Tooltip } from 'antd';
import cn from 'classnames';
import * as React from 'react';
import './style.scss';

const loadingIcon = (
	<LoadingOutlined style={{ fontSize: 24, color: 'white' }} spin />
);

interface Props {
	icon: any;
	onClick: any;
	tooltip: string;
	loading?: boolean;
	disabled?: boolean;
	className?: any;
}

const ButtonIcon = ({
	onClick,
	icon,
	tooltip,
	loading,
	disabled,
	className,
}: Props) => (
	<Tooltip placement="top" title={tooltip}>
		<button
			className={cn('ButtonIcon', className, {
				ButtonIcon__disabled: disabled,
				ButtonIcon__loading: loading,
			})}
			tabIndex={-1}
			type="button"
			onClick={onClick}
		>
			{loading ? <Spin indicator={loadingIcon} /> : <>{icon}</>}
		</button>
	</Tooltip>
);

export default ButtonIcon;
