let head = document.getElementsByTagName('head')[0];
let js = document.createElement("script");

js.type = "text/javascript";
const provider = store.get('settings.provider', 'streamlabs');

if (provider === 'streamlabs'){
    js.src = "js/provider/streamlabs.js";
}

head.appendChild(js);