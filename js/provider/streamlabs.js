const socketToken = store.get('settings').socketToken;
const streamlabs = io(`https://sockets.streamlabs.com?token=${socketToken}`);

streamlabs.on('event', (eventData) => {
    if (!eventData.for && eventData.type === 'donation') {
        lifxRequest('donations');
        console.log(eventData.message);
    }
    if (eventData.for === 'twitch_account') {
        switch(eventData.type) {
            case 'follow':
                lifxRequest('follower');
                console.log(eventData.message);
                break;
            case 'subscription':
                lifxRequest('subscriber');
                console.log(eventData.message);
                break;
            default:
                lifxRequest('follower');
                console.log(eventData.message[0].name);
        }
    }
});