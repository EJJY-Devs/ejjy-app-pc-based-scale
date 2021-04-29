import React from 'react';
import { Redirect, Route, useLocation } from 'react-router-dom';
import { userTypes } from '../../global/types';
import { useAuth } from '../../hooks/useAuth';

const portal = ['/login'];
const not404Pages = ['/', '/login', 'reports'];
const noAuthPages = ['/reports'];

export const CommonRoute = ({ path, exact, component }: any) => {
	const { pathname: pathName } = useLocation();
	const { user, accessToken, localIpAddress } = useAuth();
	const isLoggedIn = user && accessToken && localIpAddress;

	if (!noAuthPages.includes(pathName)) {
		if (portal.includes(pathName) && isLoggedIn) {
			return <Route render={() => <Redirect to="/" />} />;
		}

		if (!portal.includes(pathName) && !isLoggedIn) {
			return <Route render={() => <Redirect to="/login" />} />;
		}

		if (!not404Pages.includes(pathName) && !component[userTypes.BRANCH_PERSONNEL]) {
			return <Route render={() => <Redirect to="404" />} />;
		}
	}

	return (
		<Route
			path={path}
			exact={exact}
			component={component[userTypes.BRANCH_PERSONNEL] || component}
		/>
	);
};
