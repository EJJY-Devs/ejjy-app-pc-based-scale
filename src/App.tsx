import React from 'react';
import { Helmet } from 'react-helmet';
import { Redirect, Route, Switch } from 'react-router-dom';
import { APP_TITLE } from './global/constants';
import Login from './screens/Login/Login';
import Main from './screens/Main/Main';

const App = () => (
	<>
		<Helmet>
			<title>{APP_TITLE}</title>
		</Helmet>
		<Switch>
			<Route path="/login" exact component={Login} />
			<Route path="/main" exact component={Main} />

			<Redirect from="/" to="/login" />
		</Switch>
	</>
);

export default App;
