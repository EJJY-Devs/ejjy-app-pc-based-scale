import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';
import { cn } from 'utils';
import React from 'react';

type Props = {
	className?: string;
	disabled?: boolean;
	loading?: boolean;
	title: string | React.ReactNode;
	onClick: () => void;
};

export const ScaleButton = ({
	className,
	disabled,
	loading,
	title,
	onClick,
}: Props) => (
	<button
		className={cn(
			'cursor-pointer rounded-lg border-2 border-b-4 border-solid border-transparent border-b-black/25 bg-gray px-2 py-3 text-xl font-bold text-[#858585] outline-0 hover:opacity-70',
			className,
			{
				'pointer-events-none border-2 border-[#b2b2b2] bg-white opacity-30 shadow-none':
					disabled || loading,
			},
		)}
		type="button"
		onClick={onClick}
	>
		{loading ? (
			<Spin
				className="leading-none"
				indicator={
					<LoadingOutlined
						style={{ fontSize: 17, color: 'rgba(35, 37, 46, 0.85)' }}
						spin
					/>
				}
			/>
		) : (
			title
		)}
	</button>
);
