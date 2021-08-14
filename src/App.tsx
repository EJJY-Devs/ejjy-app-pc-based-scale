import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Login from './screens/Login/Login';
import Main from './screens/Main/Main';

const App = () => (
	<Switch>
		<Route path="/" exact component={Login} />
		<Route path="/main" exact component={Main} />
	</Switch>
);

export default App;
