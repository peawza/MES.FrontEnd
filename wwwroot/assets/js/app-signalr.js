class AppSignalR {
    constructor(options) {
        options = $.extend(true, {
            url: '/',
            reconnect: [0, 1000, 5000],
            reconnecting: error => console.log(`Connection lost due to error "${error}". Reconnecting.`),
            reconnected: connectionId => console.log(`Connection reestablished. Connected with connectionId "${connectionId}".`),
            close: error => console.log(`Connection closed due to error "${error}". Try refreshing this page to restart the connection.`),
        }, options);

        this.connection = new signalR.HubConnectionBuilder()
            .withUrl(options.url)
            .withAutomaticReconnect(options.reconnect)
            .configureLogging(signalR.LogLevel.Information)
            .build();

        this.connection.onreconnecting(options.reconnecting);
        this.connection.onreconnected(options.reconnected);
        this.connection.onclose(options.close);
    }

    start = async function () {
        await this.connection.start();
    }

    stop = async function () {
        await this.connection.stop();
    }
}