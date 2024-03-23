/* eslint-disable prefer-destructuring */
const { app, BrowserWindow, dialog } = require('electron');
const { autoUpdater } = require('electron-updater');
const isDev = require('electron-is-dev');
const log = require('electron-log');
const path = require('path');

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
function logStatus(text) {
	log.info(text);

	if (mainWindow) {
		mainWindow.webContents.send('message', text);
	}
}

let mainWindow;
let splashWindow;
function createWindow() {
	// Splash screen
	splashWindow = new BrowserWindow({
		width: 600,
		height: 450,
		transparent: true,
		frame: false,
		alwaysOnTop: true,
	});
	splashWindow.loadURL(`file://${__dirname}/splash.html`);

	// Main screen
	mainWindow = new BrowserWindow({
		width: 800,
		height: 600,
		show: false,
	});

	setTimeout(() => {
		app.isPackaged
			? mainWindow.loadFile(path.join(__dirname, 'index.html'))
			: mainWindow.loadURL('http://localhost:3004');
	}, 2000);

	mainWindow.once('ready-to-show', () => {
		splashWindow.destroy();
		mainWindow.maximize();
		mainWindow.show();
	});

	mainWindow.on('closed', () => {
		mainWindow = null;
		splashWindow = null;
	});

	startServer();
}

//-------------------------------------------------------------------
// Server
//-------------------------------------------------------------------
function startServer() {
	let startScaleServer = null;
	if (isDev) {
		startScaleServer = require('./server/server-dev');
	} else {
		startScaleServer = require('../build/server/server-prod');
	}

	const scaleAndPrinterPath = path.join(
		process.resourcesPath,
		'scale',
		'Scale and Printer.exe',
	);
	startScaleServer(scaleAndPrinterPath);
}

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
				buttons: ['Download Update'],
				cancelId: -1,
			})
			.then(({ response }) => {
				if (response === 0) {
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
