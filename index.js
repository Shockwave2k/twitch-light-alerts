const electron = require('electron');
const url = require('url');
const path = require('path');

const {app, BrowserWindow} = electron;

let mainWindow;

app.on('ready', function() {
    mainWindow = new BrowserWindow({
        width: 350,
        height: 530,
        resizable: false,
        frame: true,
        'auto-hide-menu-bar': true,
        'use-content-size': true
    });

    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file',
        slashes: true
    }));

    mainWindow.on('closed', function (){
        app.quit();
    });
});


