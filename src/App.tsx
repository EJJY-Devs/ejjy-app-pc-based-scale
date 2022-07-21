import React from 'react';
import { Helmet } from 'react-helmet';
import { Route, Switch } from 'react-router-dom';
import npmPackage from '../package.json';
import { Connectivity } from './components';
import { APP_TITLE } from './global/constants';
import { useSiteSettings } from './hooks';
import Login from './screens/Login/Login';
import Main from './screens/Main/Main';

const refetchQueryData = {
	options: {
		refetchInterval: 60000,
		refetchIntervalInBackground: true,
		notifyOnChangeProps: [],
	},
};

const App = () => {
	useSiteSettings(refetchQueryData);
	// TODO: Disable temporarily
	// useInitializeData();

	return (
		<>
			<Helmet title={`${APP_TITLE} (v${npmPackage.version})`} />

			<Connectivity />

			<Switch>
				<Route component={Login} path="/" exact />
				<Route component={Main} path="/main" exact />
			</Switch>
		</>
	);
};

export default App;
