class ImageUpdater {

    constructor(websocket) {
        this.websocket = websocket
    }

    updateImage(context, image, target = Destination.HARDWARE_AND_SOFTWARE) {
        const json = {
            "event": "setImage",
            "context": context,
            "payload": {
                image,
                target,
            }
        }
        this.websocket.send(JSON.stringify(json));
    }
}