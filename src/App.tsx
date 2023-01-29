import React from 'react';
import { Helmet } from 'react-helmet';
import { Route, Switch } from 'react-router-dom';
import NetworkError from 'screens/NetworkError';
import useInterval from 'use-interval';
import { getBranchMachine } from 'utils/function';
import npmPackage from '../package.json';
import { AppIcons } from './components';
import { APP_TITLE } from './global/constants';
import { useBranchMachinePing, useSiteSettings } from './hooks';
import Main from './screens/Main/Main';

const refetchQueryData = {
	options: {
		refetchInterval: 60000,
		refetchIntervalInBackground: true,
		notifyOnChangeProps: [],
	},
};

const App = () => {
	// VARIABLES
	const branchMachine = getBranchMachine(true);

	// CUSTOM HOOKS
	useSiteSettings(refetchQueryData);
	// useInitializeData(); // TODO: Disable temporarily

	const { mutateAsync: pingBranchMachine } = useBranchMachinePing();
	useInterval(
		async () => {
			await pingBranchMachine({ id: branchMachine.id });
		},
		branchMachine ? 5000 : null,
	);

	return (
		<>
			<Helmet title={`${APP_TITLE} (v${npmPackage.version})`} />

			<AppIcons />

			<Switch>
				{/* <Route component={Login} path="/" exact /> */}
				<Route component={Main} path="/" exact />
				<Route component={NetworkError} path="/error" exact />
			</Switch>
		</>
	);
};

export default App;
