const request = require('@studio/json-request');

function lifxRequest(name) {
    let data = store.get(name);
    let url = 'https://api.lifx.com/v1/lights/all/effects/' + data.effect.toLowerCase();
    let lifxToken = store.get('settings').lifxToken;

    let requestBody = {
        period: data.period,
        cycles: data.cycles,
        power_on: (data.switch === 'on' ? 'true' : 'false'),
        color: 'hue:' + data.hue + ' saturation:' + data.sat/100 + ' brightness:' + data.bright/100
    };

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.setRequestHeader("Authorization", "Bearer " + lifxToken);
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            console.log('yeahhh');
        }
    };
    xhr.send(JSON.stringify(requestBody));
}