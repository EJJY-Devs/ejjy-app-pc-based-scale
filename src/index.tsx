import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import React from 'react';
import ReactDOM from 'react-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Router } from 'react-router-dom';
import App from './App';
import configureAxios from './configureAxios';
import './index.scss';
import * as serviceWorker from './serviceWorker';
import history from './utils/history';
import { ConfigProvider } from 'antd';

// Configure timezone
dayjs.extend(customParseFormat);
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault('Asia/Manila');

// Start Interceptor
configureAxios();

const queryClient = new QueryClient();

ConfigProvider.config({
	theme: {
		primaryColor: '#20bf6b',
		errorColor: '#fc5c65',
	},
});

ReactDOM.render(
	<React.StrictMode>
		<QueryClientProvider client={queryClient}>
			<ConfigProvider>
				<Router history={history}>
					<App />
				</Router>
			</ConfigProvider>
		</QueryClientProvider>
	</React.StrictMode>,
	document.getElementById('root'),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
