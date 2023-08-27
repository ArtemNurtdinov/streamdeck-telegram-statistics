$PI.onConnected(jsn => {
    console.log('Property Inspector connected', jsn);
    initPropertyInspector();
    console.log(jsn.actionInfo.payload.settings);
    Object.entries(jsn.actionInfo.payload.settings).forEach(([key, value]) => {
        console.log('setting', key, value);
        const el = document.getElementById(key);
        if (el) {
            el.value = value;
        }
    });
});

function saveClicked() {
    const tgBotToken = document.getElementById('tgBotToken').value;
    const telegramChannelName = document.getElementById('telegramChannelName').value;
    $PI.setSettings({'tgBotToken': tgBotToken, 'telegramChannelName': telegramChannelName});
}

function initPropertyInspector() {
}

function openDocumentationClicked() {
    const url = 'https://github.com/ArtemNeFRiT/streamdeck-telegram-statistics#Configuration'
    $PI.openUrl(url)
}

function sendValueToPlugin(value, param) {
    $PI.sendToPlugin({[param]: value});
}