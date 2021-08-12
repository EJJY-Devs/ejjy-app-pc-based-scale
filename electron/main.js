const { app, BrowserWindow, Menu, MenuItem } = require('electron');
const path = require('path');

let mainWindow;
function createWindow() {
	require('../build/js/server');

	mainWindow = new BrowserWindow({
		width: 800,
		height: 600,
		show: false,
	});

	mainWindow.loadURL(`file://${path.join(__dirname, '../build/index.html')}`);
	mainWindow.once('ready-to-show', () => {
		mainWindow.maximize();
		mainWindow.show();
	});

	mainWindow.on('closed', () => {
		mainWindow = null;
	});

	// Remove menu
	const menu = new Menu();
	menu.append(
		new MenuItem({
			label: 'Dev',
			submenu: [{ role: 'toggleDevTools' }, { role: 'forceReload' }],
		}),
	);
	Menu.setApplicationMenu(menu);
}

// Set single instance
const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
	app.quit();
} else {
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
