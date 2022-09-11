const { ipcRenderer, contextBridge } = require('electron');

contextBridge.exposeInMainWorld('electron', {
    connectionApi: {
        create(connection) {
            return ipcRenderer.sendSync('create-connection', connection);
        },
        open(connection) {
            return ipcRenderer.sendSync('open-connection', connection);
        },
        close(connection) {
            return ipcRenderer.sendSync('close-connection', connection);
        },
        delete(connection) {
            return ipcRenderer.sendSync('delete-connection', connection);
        },
        list() {
            return ipcRenderer.sendSync('list-connection');
        }
    }
})