const Destination = {
    HARDWARE_AND_SOFTWARE: 0,
    HARDWARE_ONLY: 1,
    SOFTWARE_ONLY: 2,
};

class Elgato {

    constructor(url, port, pluginUUID, inRegisterEvent) {
        this.websocket = new WebSocket(url + port)

        const titleUpdater = new TitleUpdater(this.websocket)
        const urlOpener = new URLOpener(this.websocket)

        this.telegramSubscribersAction = new TelegramSubscribersAction(titleUpdater, urlOpener)

        this.websocket.onopen = () => {
            this.registerPlugin(pluginUUID, inRegisterEvent);
        };

        this.websocket.onclose = () => {
        };

        this.websocket.onmessage = (evt) => {
            const jsonObj = JSON.parse(evt.data);
            const event = jsonObj['event'];
            const actionJson = jsonObj['action'];
            const context = jsonObj['context'];

            const jsonPayload = jsonObj && jsonObj['payload'];
            const settings = jsonPayload && jsonPayload['settings'];
            const coordinates = jsonPayload && jsonPayload['coordinates'];
            const userDesiredState = jsonPayload && jsonPayload['userDesiredState'];

            let action

            switch (actionJson) {
                case TelegramSubscribersAction.ACTION_UUID:
                    action = this.telegramSubscribersAction
                    break;
            }

            switch (event) {
                case TelegramSubscribersAction.ACTION_EVENT_KEY_DOWN:
                    action.onKeyDown(context, settings, coordinates, userDesiredState);
                    break;
                case TelegramSubscribersAction.ACTION_EVENT_KEY_UP:
                    action.onKeyUp(context, settings, coordinates, userDesiredState);
                    break;
                case TelegramSubscribersAction.ACTION_EVENT_WILL_APPEAR:
                    action.onWillAppear(context, settings, coordinates);
                    break;
                case TelegramSubscribersAction.ACTION_EVENT_WILL_DISAPPEAR:
                    action.onWillDisappear(context, settings, coordinates);
                    break;
                case TelegramSubscribersAction.ACTION_EVENT_DID_RECEIVE_SETTINGS:
                    action.didReceiveSettings(context, settings, coordinates);
                    break;
            }

        }
    }

    registerPlugin(inPluginUUID, inRegisterEvent) {
        const json = {
            "event": inRegisterEvent,
            "uuid": inPluginUUID
        };

        this.websocket.send(JSON.stringify(json));
    }
}