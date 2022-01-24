/* eslint-disable prefer-destructuring */
const { app, BrowserWindow, dialog } = require('electron');
const { autoUpdater } = require('electron-updater');
const isDev = require('electron-is-dev');
const log = require('electron-log');
const path = require('path');
// const child_process = require('child_process');

//-------------------------------------------------------------------
// Auto Updater
//-------------------------------------------------------------------
autoUpdater.autoDownload = false;
autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = 'info';
log.info('App starting...');

//-------------------------------------------------------------------
// Initialization
//-------------------------------------------------------------------
let mainWindow;
function createWindow() {
	if (isDev) {
		require('./server/server-dev');
	} else {
		require('../build/server/server-prod');
	}

	mainWindow = new BrowserWindow({
		width: 800,
		height: 600,
		show: false,
	});

	mainWindow.loadURL(
		isDev
			? 'http://localhost:3000'
			: `file://${path.join(__dirname, '../build/index.html')}`,
	);

	// const API_PATH = app.isPackaged
	// 	? path.join(process.resourcesPath, 'api')
	// 	: path.join(__dirname, '../api');

	// const loader = child_process.spawn('poetry run python manage.py runserver', {
	// 	cwd: API_PATH,
	// 	detached: true,
	// 	shell: true,
	// });
	// pid = loader.pid;

	mainWindow.once('ready-to-show', () => {
		mainWindow.maximize();
		mainWindow.show();
	});

	mainWindow.on('closed', () => {
		mainWindow = null;
	});
}

// App close handler
// app.on('before-quit', () => {
// 	log.info(`pid: ${pid}`);
// 	const result = process.kill(pid);
// 	log.info(`result: ${result}`);
// 	if (pid) {
// 		process.kill(pid, (err) => {
// 			if (err) {
// 				throw new Error(err);
// 			} else {
// 				log.info(`Process %s has been killed! ${pid}`);
// 			}
// 		});
// 	}
// });

process.on('uncaughtException', (error) => {
	// Handle the error
	log.error(`error: ${error}`);
});

//-------------------------------------------------------------------
// Set single instance
//-------------------------------------------------------------------
const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
	app.quit();
} else {
	// eslint-disable-next-line no-unused-vars
	app.on('second-instance', (event, commandLine, workingDirectory) => {
		// Someone tried to run a second instance, we should focus our window.
		if (mainWindow) {
			if (mainWindow.isMinimized()) mainWindow.restore();
			mainWindow.focus();
		}
	});

	// Create myWindow, load the rest of the app, etc...
	app.on('ready', createWindow);
}

//-------------------------------------------------------------------
// Check for updates
//
// We must only perform auto update in Windows OS
//-------------------------------------------------------------------

function logStatus(text) {
	log.info(text);
	mainWindow.webContents.send('message', text);
}
if (process.platform === 'win32') {
	autoUpdater.on('checking-for-update', () => {
		logStatus('Checking for update...');
	});

	autoUpdater.on('update-available', (info) => {
		dialog
			.showMessageBox(mainWindow, {
				type: 'info',
				title: 'Software Update',
				message: `PC Based Scale App ${info.version} is now available. Please press the button below to download the update.`,
				buttons: ['Update Now'],
			})
			.then(({ response }) => {
				// eslint-disable-next-line eqeqeq
				if (response == 0) {
					autoUpdater.downloadUpdate();
				}
			});
	});

	autoUpdater.on('update-not-available', () => {
		logStatus('Update not available');
	});

	autoUpdater.on('error', (err) => {
		logStatus(`Error in auto-updater: ${err}`);
	});

	autoUpdater.on('download-progress', (progress) => {
		mainWindow.setProgressBar(Number(progress.percent) / 100);

		let log_message = `Download speed: ${progress.bytesPerSecond}`;
		log_message = `${log_message} - Downloaded ${progress.percent}%`;
		log_message = `${log_message} (${progress.transferred}/${progress.total})`;
		logStatus(log_message);
	});

	autoUpdater.on('update-downloaded', () => {
		logStatus('Update downloaded');

		dialog
			.showMessageBox(mainWindow, {
				type: 'info',
				title: 'Software Update',
				message:
					'EJJY PC-Based Scale App is successfully updated. Please press the button below to install the update.',
				buttons: ['Install'],
			})
			.then(() => {
				autoUpdater.quitAndInstall();
			});
	});

	app.on('ready', () => {
		autoUpdater.checkForUpdates();
	});
}
