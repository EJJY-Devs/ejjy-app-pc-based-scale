import { Divider, Drawer, Tabs } from 'antd';
import { startCase, toLower } from 'lodash';
import React, { useState } from 'react';
import { Label } from '../../../../components/elements';
import ControlledInput from '../../../../components/elements/ControlledInput/ControlledInput';
import { TableWeightProducts } from '../../../../components/TableWeightProducts/TableWeightProducts';
import { MainButton } from '../MainButtons/MainButton';
import './style.scss';
import { TextcodeModal } from './TextcodeModal';

const tabs = {
	BABOY: 'BABOY',
	MANOK: 'MANOK',
	ASSORTED: 'ASSORTED',
};

const columns = [{ name: 'Description' }];

const baboyDataSource = [
	['Baboy 1'],
	['Baboy 2'],
	['Baboy 3'],
	['Baboy 1'],
	['Baboy 2'],
	['Baboy 3'],
	['Baboy 1'],
	['Baboy 2'],
	['Baboy 3'],
];
const manokDataSource = [
	['Manok 1'],
	['Manok 2'],
	['Manok 3'],
	['Manok 1'],
	['Manok 2'],
	['Manok 3'],
	['Manok 1'],
	['Manok 2'],
	['Manok 3'],
];
const assortedDataSource = [
	['Assorted 1'],
	['Assorted 2'],
	['Assorted 3'],
	['Assorted 1'],
	['Assorted 2'],
	['Assorted 3'],
	['Assorted 1'],
	['Assorted 2'],
	['Assorted 3'],
];

export const WeightDrawer = ({ visible, onClose }) => {
	// STATES
	const [weight, setWeight] = useState('1.500');
	const [selectedProduct, setSelectedProduct] = useState(null);
	const [dataSource, setDataSource] = useState([]);
	const [textcodeModalVisible, setTextcodeModalVisible] = useState(false);

	return (
		<Drawer
			className="WeightDrawer"
			visible={visible}
			placement="right"
			width="50%"
			onClose={onClose}
			closable={false}
			maskClosable
		>
			<Label id="weight" label="Weight" spacing />
			<ControlledInput
				classNames="input-weight"
				value={weight}
				onChange={(value) => setWeight(value)}
				disabled
			/>

			{selectedProduct === null ? (
				<>
					<Divider>SELECT PRODUCT</Divider>

					<Tabs defaultActiveKey={tabs.BABOY} type="card">
						<Tabs.TabPane key={tabs.BABOY} tab={startCase(toLower(tabs.BABOY))}>
							<TableWeightProducts
								activeRow={-1}
								columns={columns}
								data={baboyDataSource}
								loading={false}
							/>
						</Tabs.TabPane>

						<Tabs.TabPane key={tabs.MANOK} tab={startCase(toLower(tabs.MANOK))}>
							<TableWeightProducts
								activeRow={-1}
								columns={columns}
								data={manokDataSource}
								loading={false}
							/>
						</Tabs.TabPane>

						<Tabs.TabPane key={tabs.ASSORTED} tab={startCase(toLower(tabs.ASSORTED))}>
							<TableWeightProducts
								activeRow={-1}
								columns={columns}
								data={assortedDataSource}
								loading={false}
							/>
						</Tabs.TabPane>
					</Tabs>

					<Divider>TEXTCODE</Divider>
					<MainButton
						classNames="btn-input-texcode"
						title="Input Textcode"
						onClick={() => setTextcodeModalVisible(true)}
					/>
				</>
			) : null}

			<TextcodeModal
				visible={textcodeModalVisible}
				onClose={() => setTextcodeModalVisible(false)}
			/>
		</Drawer>
	);
};
