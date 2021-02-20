import React from 'react';
import { Helmet } from 'react-helmet';
import { Redirect, Route, Switch } from 'react-router-dom';
import { CommonRoute } from './components';
import { APP_TITLE } from './global/constants';
import { Error404, Login } from './screens';
import { MainScreens } from './utils/routeMapping';

const App = () => (
	<>
		<Helmet>
			<title>{APP_TITLE}</title>
		</Helmet>
		<Switch>
			<CommonRoute path="/login" exact component={Login} />
			<CommonRoute path="/" exact component={MainScreens} />

			<Route path="/404" exact component={Error404} />
			<Route path="" render={() => <Redirect to="/404" />} />
		</Switch>
	</>
);

export default App;
