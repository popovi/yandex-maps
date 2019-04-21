import { socket } from "./initLibrary";
import * as constants from "../constants";

class SocketDataSource {
    constructor() {
        this.handlers = [];

        this[constants.socketServerResponses.GET_OPTIONS_PLACEMARKS] = this[constants.socketServerResponses.GET_OPTIONS_PLACEMARKS].bind(this);
        this[constants.socketServerResponses.FIND_PLACEMARK] = this[constants.socketServerResponses.FIND_PLACEMARK].bind(this);
        this[constants.socketServerResponses.GET_ITERMEDIATE_PLACEMARKS] = this[constants.socketServerResponses.GET_ITERMEDIATE_PLACEMARKS].bind(this);

        // initialize subscriptions
        for (let methodKey in constants.socketServerResponses) {
            const methodInThis = this[constants.socketServerResponses[methodKey]];

            if (methodInThis)
                socket.on(constants.socketServerResponses[methodKey], methodInThis);
        };
        //
    }

    [constants.socketServerResponses.GET_OPTIONS_PLACEMARKS](payload) {
        this.handlers.forEach(handler => {
            handler(constants.socketServerResponses.GET_OPTIONS_PLACEMARKS, payload);
        });
    }

    [constants.socketServerResponses.FIND_PLACEMARK](payload) {
        this.handlers.forEach(handler => {
            handler(constants.socketServerResponses.FIND_PLACEMARK, payload);
        });
    }

    [constants.socketServerResponses.GET_ITERMEDIATE_PLACEMARKS](payload) {
        this.handlers.forEach(handler => {
            handler(constants.socketServerResponses.GET_ITERMEDIATE_PLACEMARKS, payload);
        });
    }

    addDataListener(handler) {
        this.handlers.push(handler);
    }
}

const socketDataSource = new SocketDataSource();

export { socketDataSource }