const electron = require('electron');
const remote = require('electron').remote;
const {shell, ipcRenderer} = electron;
const Store = require('electron-store');
const store = new Store();
let win;

window.$ = window.jQuery = require('jquery');
window.Popper = require('popper.js');
require('bootstrap');

function saveForm(name) {
    const data = getFormData(document.forms[name]);
    store.set(name, data)
}

function openExternal(url) {
    shell.openExternal(url)
}

function newBrowserWindow() {
    const BrowserWindow = remote.BrowserWindow;
    return new BrowserWindow({
        width: 800,
        height: 600,
        frame: true,
        resizable: false,
        webPreferences: {
            nodeIntegration: false
        },
    });
}

function providerToken() {
    const settings = store.get('settings');
    win = newBrowserWindow();

    if(settings.provider === 'streamlabs') {
        win.loadURL('https://www.streamlabs.com/api/v1.0/authorize?client_id=9JXyQsH9fUQ34KPresGZIsMEOnkVRV0Rva7w2nCy&redirect_uri=http://twitch.bad-media.de/auth.php&response_type=code&scope=donations.read+socket.token');
    }

    /** @returns {Promise<string>} */
    function checkForData() {
        return win.webContents.executeJavaScript('document.getElementById(\'accessToken\').value', true)
    }

    let checkExist = setInterval(function() {
        checkForData().then((accessToken) => {
            if (accessToken) {
                win.webContents.executeJavaScript('document.getElementById(\'refreshToken\').value', true)
                    .then((refreshToken) => {
                        ipcRenderer.send('AccessTokens', JSON.stringify(accessToken), JSON.stringify(refreshToken));
                    });
                clearInterval(checkExist);
            }
        });
    }, 2000);
}

function refreshToken() {
    const settings = store.get('settings');
    if(settings.provider === 'streamlabs') {
        window.open('http://twitch.bad-media.de/auth?refreshToken=' + store.get('settings')['refreshToken'], 'refreshToken');
    }
}

function minimize(){
    remote.getCurrentWindow().minimize();
}

function closeapp() {
    remote.app.quit();
}

const imports = ['donations', 'follower', 'subscriber', 'settings', 'info'];
imports.forEach(function(element) {
    let content = document.getElementById(element).import.activeElement.firstChild;
    let tab = document.getElementById('nav-' + element);
    tab.appendChild(content);
});

const defaultForms = ['donations', 'follower', 'subscriber'];
const formTemplate = document.getElementById('form').import.activeElement.firstChild;
defaultForms.forEach(function(element) {
    let clone = formTemplate.cloneNode(true);
    let form = document.forms[element];
    form.appendChild(clone);
});

const allForms = document.forms;
for(let i=0; i<allForms.length; i++) {
    let singleForm = allForms[i];
    let data = store.get(singleForm.id);
    populate(singleForm, data);
}

function populate(frm, data) {
    $.each(data, function(key, value) {
        let ctrl = $('[id='+key+']', frm);
        switch(ctrl.prop("type")) {
            case "radio": case "checkbox":
            ctrl.each(function() {
                if($(this).val() === value) $(this).attr("checked",true);
            });
            break;
            default:
                ctrl.val(value);
        }
    });
}
