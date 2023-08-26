class TitleUpdater {

    constructor(websocket) {
        this.websocket = websocket
    }

    updateTitle(context, title) {
        const json = {
            "event": "setTitle",
            "context": context,
            "payload": {
                "title": "" + title,
                "target": Destination.HARDWARE_AND_SOFTWARE
            }
        };

        this.websocket.send(JSON.stringify(json));
    }
}