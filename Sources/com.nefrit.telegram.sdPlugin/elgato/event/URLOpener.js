class URLOpener {

    constructor(websocket) {
        this.websocket = websocket
    }

    open(url) {
        const json = {
            "event": "openUrl",
            "payload": {
                url
            }
        };
        this.websocket.send(JSON.stringify(json));
    }
}