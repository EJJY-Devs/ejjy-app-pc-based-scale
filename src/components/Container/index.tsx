import { Spin } from 'antd';
import React from 'react';

type Props = {
	loadingText?: string;
	loading?: boolean;
	children: React.ReactNode;
};

export const Container = ({
	loading,
	loadingText = 'Fetching data...',
	children,
}: Props) => (
	<Spin
		size="large"
		spinning={loading}
		tip={loadingText}
		wrapperClassName="w-full h-full min-h-dvh p-4 flex items-center justify-center"
	>
		{children}
	</Spin>
);
