import { socket } from "./initLibrary";
import * as constants from "../constants";

function getOptionsPlacemarks(elementName, requestCounter, firstLetters) {
    socket.emit(constants.socketServerResponses.GET_OPTIONS_PLACEMARKS, {
        elementName,
        requestCounter,
        data: { firstLetters }
    });
}

function findPlacemark(elementName, placemarkId) {
    socket.emit(constants.socketServerResponses.FIND_PLACEMARK, {
        elementName,
        data: { placemarkId }
    });
}

function getIntermediatePlacemarks(firstId, secondId) {
    socket.emit(constants.socketServerResponses.GET_ITERMEDIATE_PLACEMARKS, {
        data: {
            firstId,
            secondId
        }
    });
}

export {
    getOptionsPlacemarks,
    getIntermediatePlacemarks,
    findPlacemark
}