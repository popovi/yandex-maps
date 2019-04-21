import {
    getOptionsPlacemarks,
    getIntermediatePlacemarks,
    findPlacemark
} from "../lib/socketServer";
import * as constants from "../lib/constants";

function onSocket(socket) {
    socket.on(constants.socketServerResponses.GET_OPTIONS_PLACEMARKS, function (options) {
        const placemarks = getOptionsPlacemarks(options.data);
        socket.emit(constants.socketServerResponses.GET_OPTIONS_PLACEMARKS, {
            elementName: options.elementName,
            answerCounter: options.requestCounter + 1,
            data: { placemarks }
        });
    });

    socket.on(constants.socketServerResponses.FIND_PLACEMARK, function (options) {
        const placemark = findPlacemark(options.data);
        socket.emit(constants.socketServerResponses.FIND_PLACEMARK, {
            elementName: options.elementName,
            data: { placemark }
        });
    });

    socket.on(constants.socketServerResponses.GET_ITERMEDIATE_PLACEMARKS, function (options) {
        const placemarks = getIntermediatePlacemarks(options.data);
        socket.emit(constants.socketServerResponses.GET_ITERMEDIATE_PLACEMARKS, {
            data: { placemarks }
        });
    });
}

export { onSocket }