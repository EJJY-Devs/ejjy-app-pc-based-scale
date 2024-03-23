import {
	REFETCH_SYNC_INTERVAL_MS,
	useBranchMachinePing,
	useSiteSettings,
} from 'ejjy-global';
import React, { useEffect } from 'react';
import { Route, Switch } from 'react-router-dom';
import Inactive from 'screens/Inactive';
import NetworkError from 'screens/NetworkError';
import { useInterval } from 'use-interval';
import { getBranchMachine, getBranchServerUrl } from 'utils/function';
import npmPackage from '../package.json';
import { AppIcons } from './components';
import { APP_TITLE } from './global/constants';
import './index.css';
import Main from './screens/Main';

const App = () => {
	// VARIABLES
	const branchMachine = getBranchMachine(true);

	// CUSTOM HOOKS
	useSiteSettings({
		options: {
			staleTime: 0,
			notifyOnChangeProps: ['data'],
			refetchInterval: REFETCH_SYNC_INTERVAL_MS,
			refetchIntervalInBackground: true,
		},
	});
	// useInitializeData(); // TODO: Disable temporarily

	const { mutateAsync: pingBranchMachine } = useBranchMachinePing();
	useInterval(
		async () => {
			await pingBranchMachine({
				onlineBranchMachineId: branchMachine.id,
				onlineApiUrlOverride: getBranchServerUrl(),
			});
		},
		branchMachine ? 5000 : null,
	);

	useEffect(() => {
		document.title = `${APP_TITLE} (v${npmPackage.version})`;
	}, []);

	return (
		<>
			<AppIcons />

			<Switch>
				{/* <Route component={Login} path="/" exact /> */}
				<Route component={Main} path="/" exact />
				<Route component={NetworkError} path="/error" exact />
				<Route component={Inactive} path="/inactive" exact />
			</Switch>
		</>
	);
};

export default App;
