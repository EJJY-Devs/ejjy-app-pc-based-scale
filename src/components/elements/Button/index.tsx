import { LoadingOutlined } from '@ant-design/icons';
import { Spin, Tooltip } from 'antd';
import { TooltipPlacement } from 'antd/lib/tooltip';
import { cn } from 'utils';
import * as React from 'react';
import { cva } from 'cva';

const buttonVariants = cva(
	'font-bold min-w-full  inline-block border-[1px] border-solid rounded-md cursor-pointer transition duration-300',
	{
		variants: {
			variant: {
				default:
					'text-dark border-dark bg-transparent hover:bg-dark hover:text-white',
				primary:
					'text-white bg-primary border-primary shadow-md shadow-primary_05 hover:shadow-primary_08',
				secondary:
					'bg-secondary border-secondary shadow-md shadow-secondary_05 hover:shadow-secondary_08',
			},
			size: {
				default: 'text-base py-[10px] px-4',
				lg: 'text-3xl py-4 px-7 border-2',
			},
		},
		defaultVariants: {
			variant: 'default',
			size: 'default',
		},
	},
);

const loadingIcon = (
	<LoadingOutlined style={{ fontSize: 17, color: 'white' }} spin />
);

type Props = {
	text: string | React.ReactElement;
	variant?: 'default' | 'primary' | 'secondary';
	size?: 'default' | 'lg';
	onClick?: () => void;
	type?: 'button' | 'submit' | 'reset';
	icon?: React.ReactElement;
	iconDirection?: 'left' | 'right';
	loading?: boolean;
	disabled?: boolean;
	block?: boolean;
	className?: string;
	tooltipPlacement?: TooltipPlacement;
	tooltip?: string;
	hasShortcutKey?: boolean;
};

export const Button = React.forwardRef<HTMLButtonElement, Props>(
	(
		{
			text,
			variant = 'default',
			onClick,
			type = 'button',
			icon,
			iconDirection,
			block,
			loading,
			disabled,
			className,
			tooltipPlacement = 'top',
			tooltip,
			size = 'default',
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
				className={cn(
					buttonVariants({
						variant,
						size,
					}),
					className,
					{
						'flex items-center justify-center': !!icon,
						'block w-full': block,
						'px-4 py-2 text-xs font-bold': hasShortcutKey,
						'px-6 py-2 text-xs': hasShortcutKey && size === 'lg',
						'cursor-default !border-0 bg-darkGray opacity-50 shadow-none':
							disabled,
						'pointer-events-none opacity-80': loading,
					},
				)}
				type={type}
				onClick={disabled ? () => false : onClick}
			>
				{loading ? (
					<Spin className="leading-none" indicator={loadingIcon} />
				) : (
					<>
						{iconDirection === 'left' && <div className="mr-1">{icon}</div>}
						{text}
						{iconDirection === 'right' && <div className="ml-1">{icon}</div>}
					</>
				)}
			</button>
		</Tooltip>
	),
);

Button.displayName = 'Button';
