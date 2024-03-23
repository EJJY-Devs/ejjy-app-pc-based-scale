import { LoadingOutlined } from '@ant-design/icons';
import { Spin, Tooltip } from 'antd';
import { TooltipPlacement } from 'antd/lib/tooltip';
import { cn } from 'utils';
import * as React from 'react';
import './style.scss';

const loadingIcon = (
	<LoadingOutlined style={{ fontSize: 17, color: 'white' }} spin />
);

type Props = {
	text: string | React.ReactNode;
	variant?: 'primary' | 'secondary' | 'default' | 'dark-gray';
	size?: 'md' | 'lg';
	onClick?: any;
	type?: 'button' | 'submit' | 'reset';
	icon?: any;
	iconDirection?: 'left' | 'right';
	loading?: boolean;
	disabled?: boolean;
	block?: boolean;
	className?: any;
	tooltipPlacement?: TooltipPlacement;
	tooltip?: string;
	hasShortcutKey?: boolean;
};

// eslint-disable-next-line react/display-name
const Button = React.forwardRef<HTMLButtonElement, Props>(
	(
		{
			text,
			variant,
			onClick,
			type,
			icon,
			iconDirection,
			block,
			loading,
			disabled,
			className,
			tooltipPlacement,
			tooltip,
			size,
			hasShortcutKey,
		}: Props,
		ref,
	) => (
		<Tooltip
			overlayClassName="ButtonTooltip"
			placement={tooltipPlacement}
			title={tooltip}
		>
			<button
				ref={ref}
				className={cn('Button', className, {
					[variant]: true,
					[size]: true,
					flex: !!icon,
					hasShortcutKey,
					block,
					disabled,
					loading,
				})}
				// eslint-disable-next-line react/button-has-type
				type={type}
				onClick={disabled ? null : onClick}
			>
				{loading ? (
					<Spin className="spinner" indicator={loadingIcon} />
				) : (
					<>
						{iconDirection === 'left' && (
							<div className="icon-left">{icon}</div>
						)}
						{text}
						{iconDirection === 'right' && (
							<div className="icon-right">{icon}</div>
						)}
					</>
				)}
			</button>
		</Tooltip>
	),
);

Button.defaultProps = {
	tooltipPlacement: 'top',
	type: 'button',
	onClick: null,
	variant: 'default',
	size: 'md',
	iconDirection: null,
};

export default Button;
