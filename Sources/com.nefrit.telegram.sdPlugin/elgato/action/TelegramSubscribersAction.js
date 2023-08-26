class TelegramSubscribersAction {

    static ACTION_EVENT_KEY_DOWN = "keyDown"
    static ACTION_EVENT_KEY_UP = "keyUp"
    static ACTION_EVENT_WILL_APPEAR = "willAppear"
    static ACTION_EVENT_WILL_DISAPPEAR = "willDisappear"
    static ACTION_EVENT_DID_RECEIVE_SETTINGS = "didReceiveSettings"
    static ACTION_UUID = "com.nefrit.telegram.subscribers"

    constructor(titleUpdater, urlOpener) {
        this.titleUpdater = titleUpdater;
        this.urlOpener = urlOpener
        this.timers = new Map()
    }

    async onKeyDown(context, settings, coordinates, userDesiredState) {
    }

    async onKeyUp(context, settings, coordinates, userDesiredState) {
        let tgChannel = this.getTelegramChannel(settings)
        if (!tgChannel) return;
        const url = "https://t.me/" + tgChannel
        this.urlOpener.open(url)
    }

    async onWillAppear(context, settings, coordinates) {
        await this.createTimer(context, settings)
        await this.updateViews(context, settings);
    }

    async onWillDisappear(context, settings, coordinates) {
        await this.clearTimer(context, settings)
    }

    async didReceiveSettings(context, settings) {
        await this.updateTimer(context, settings);
        await this.updateViews(context, settings);
    }

    async updateViews(context, settings) {
        const tgBotToken = this.getTelegramBotToken(settings)
        const tgChannel = this.getTelegramChannel(settings)
        if (!tgBotToken || !tgChannel) return
        const apiUrl = "https://api.telegram.org/bot" + tgBotToken + "/getChatMembersCount?chat_id=@" + tgChannel
        console.log(apiUrl, settings)
        const response = await fetch(apiUrl)
        const data = await response.json()
        const result = data.result
        this.titleUpdater.updateTitle(context, this.formatNumber(result))
    }

    async updateTimer(context, settings) {
        await this.clearTimer(context, settings)
        await this.createTimer(context, settings)
    }

    async createTimer(context, settings) {
        if (this.timers.has(context)) {
            return
        }
        let period = 0;
        if (settings.hasOwnProperty('period')) {
            period = settings["period"] * 60000;
        }
        if (period < 60000) period = 300000
        const interval = setInterval(async () => {
            await this.updateViews(context, settings)
        }, period)

        this.timers.set(context, interval)
    }

    async clearTimer(context, settings) {
        if (!this.timers.has(context)) {
            return
        }
        const interval = this.timers.get(context)
        clearInterval(interval)
        this.timers.delete(context)
    }

    getTelegramBotToken(settings) {
        let apiKey = "";
        if (settings.hasOwnProperty('tgBotToken')) {
            apiKey = settings["tgBotToken"];
        }
        return apiKey
    }

    getTelegramChannel(settings) {
        let telegramChannel = "";
        if (settings.hasOwnProperty('telegramChannelName')) {
            telegramChannel = settings["telegramChannelName"];
        }
        return this.getTelegramChannelId(telegramChannel)
    }

    getTelegramChannelId(url) {
        if (url.includes("t.me")) {
            return url.split('/').pop();
        }
        return url
    }

    formatNumber(numberString) {
        let number = parseInt(numberString);

        if (number >= 100000000) {
            number = (number / 1000000).toFixed(1) + "M";
        } else if (number >= 1000000) {
            number = (number / 1000000).toFixed(2) + "M";
        } else if (number >= 100000) {
            number = (number / 1000).toFixed(1) + "K";
        } else if (number >= 10000) {
            number = (number / 1000).toFixed(2) + "K";
        }

        return number;
    }
}