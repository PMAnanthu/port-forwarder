const { BrowserWindow, app, ipcMain, Notification, session } = require('electron')
const path = require('path')
const { Client } = require('ssh2');

const isDev = !app.isPackaged;

var window;
let counter = 0;
let connections = []

function createWindow() {

    let custSession = session.fromPartition('port-forwarder-session')

    window = new BrowserWindow({
        width: 400,
        height: 600,
        resizable: false,
        title: 'Port-Forwarder',
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.js'),
            session: custSession
        }
    })

    setTimeout(() => {
        counter++;
        window.webContents.send('refresh', counter)
    }, 1000)

    window.loadFile('index.html')
}

if (isDev) {
    require('electron-reload')(__dirname, {
        electron: path.join(__dirname, 'node_modules', '.bin', 'electron')
    });
}

ipcMain.on('create-connection', (event, connection) => {
    connections.push(connection)
    event.returnValue = true
})

ipcMain.on('open-connection', async (event, connection) => {
    const conn = new Client();
    conn.on('ready', () => {
        console.log('Client :: ready');
    }).connect({
        host: connection.host,
        port: 22,
        username: connection.user,
        password: connection.password
    });
    connection.clientConnection = conn
    connection.isConnected = true;
    event.returnValue = connection
})

ipcMain.on('close-connection', async (event, connection) => {
    //open
   
    connection.isConnected = false;
    event.returnValue = connection
})


ipcMain.on('delete-connection', (event, connection) => {
    connections = connections.filter(data => data.id != connection.id);
    //delete connection
    event.returnValue = true
})

ipcMain.on('list-connection', (event) => {
    event.returnValue = connections
})




app.on('ready', createWindow);