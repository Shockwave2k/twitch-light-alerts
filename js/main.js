const electron = require('electron');
const remote = require('electron').remote;
const {shell} = electron;
const Store = require('electron-store');
const store = new Store();

window.$ = window.jQuery = require('jquery');
window.Popper = require('popper.js');
require('bootstrap');

function saveForm(name) {
    const data = getFormData(document.forms[name]);
    store.set(name, data)
}

function openExternal(url){
    shell.openExternal(url)
}

function providerToken(){
    const settings = store.get('settings');
    if(settings.provider === 'streamlabs') {
        shell.openExternal('https://www.streamlabs.com/api/v1.0/authorize?client_id=9JXyQsH9fUQ34KPresGZIsMEOnkVRV0Rva7w2nCy&redirect_uri=http://twitch.bad-media.de/auth.php&response_type=code&scope=donations.read+socket.token');
    }
}

function refreshToken(){
    const settings = store.get('settings');
    if(settings.provider === 'streamlabs') {
        shell.openExternal('http://twitch.bad-media.de/auth?refreshToken=' + store.get('settings')['refreshToken']);
    }
}

function minimize(){
    remote.getCurrentWindow().minimize();
}

function closeapp(){
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
