import React from 'react';
import { Helmet } from 'react-helmet';
import { Route, Switch } from 'react-router-dom';
import npmPackage from '../package.json';
import { Connectivity } from './components';
import { APP_TITLE } from './global/constants';
import Login from './screens/Login/Login';
import Main from './screens/Main/Main';

const App = () => (
	<>
		<Helmet title={`${APP_TITLE} (v${npmPackage.version})`} />

		<Connectivity />

		<Switch>
			<Route path="/" exact component={Login} />
			<Route path="/main" exact component={Main} />
		</Switch>
	</>
);

export default App;
