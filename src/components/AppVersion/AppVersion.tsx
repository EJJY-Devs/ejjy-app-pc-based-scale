/* eslint-disable react/jsx-one-expression-per-line */
import React from 'react';
import './style.scss';

export const AppVersion = () => (
	<span className="AppVersion">
		App Version {process.env.REACT_APP_NPM_VERSION}
	</span>
);
