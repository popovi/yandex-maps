import React from "react";
import ReactDOM from "react-dom";
import { Dialog, dialogTypes } from "../services/Dialog/Dialog";
import { Input } from "../Input/Input";
import {
    getOptionsPlacemarks,
    findPlacemark,
    getIntermediatePlacemarks
} from "../../../lib/socketClient/api";
import * as constants from "../../../lib/constants";
import { withSocket } from "../services/HOCs/socketClientHOC";

import "./App.scss";
import * as placemarkTrain from "../../assets/images/placemarkTrain.svg";
import * as placemarkTransient from "../../assets/images/placemarkTransient.svg";

class App extends React.Component {
    constructor(props) {
        super(props);

        // coordsId:
        // = 0 - можно принимать ответ при выборе пункта выпадающего списка
        // = -1 - нельзя
        // SocketOptions.stopReceive:
        // = true - нельзя принимать отфильтрованные пункты для выпадающего списка
        // = false - можно

        this.state = {
            isDialogVisible: false,
            dialogType: dialogTypes.INFO,
            dialogContent: "",
            fromPlacemark: {
                id: 0,
                coords: []
            },
            toPlacemark: {
                id: 0,
                coords: []
            },
            fromValue: "",
            toValue: "",
            fromOptions: [],
            toOptions: [],
            fromSocketOptions: {
                requestCounter: 0,
                stopReceive: true
            },
            toSocketOptions: {
                requestCounter: 0,
                stopReceive: true
            },
            intermediatePlacemarks: null
        }

        this.map = undefined;
        this.geoObjectCollection = undefined;

        this.mapContainer = React.createRef();

        this.mapInitialEdges = [
            [56.02680383, 37.48579387],
            [55.78534718, 37.59565715]
        ];

        this.inputNames = ["from", "to"];

        this.handleCloseDialog = this.handleCloseDialog.bind(this);
        this.handleDropDownInput = this.handleDropDownInput.bind(this);
        this.handleDropDownSelect = this.handleDropDownSelect.bind(this);
    }

    /////////////////////////////////
    // Lifecircles

    static getDerivedStateFromProps(nextProps, state) {
        if (nextProps.socketData) {
            const newState = {};

            const elementName = nextProps.socketData.recentlyElementName;

            if (elementName) {
                // receive dropdown options
                if (
                    !state[`${elementName}SocketOptions`].stopReceive
                    && state[`${elementName}SocketOptions`].requestCounter < nextProps.socketData[elementName].answerCounter
                    && nextProps.socketData[elementName][constants.socketServerResponses.GET_OPTIONS_PLACEMARKS]
                ) {
                    newState[`${elementName}Options`] = nextProps.socketData[elementName][constants.socketServerResponses.GET_OPTIONS_PLACEMARKS].placemarks || [];
                    newState[`${elementName}SocketOptions`] = state[`${elementName}SocketOptions`];
                    newState[`${elementName}SocketOptions`].requestCounter = nextProps.socketData[elementName].answerCounter;
                }
                //

                // receive placemark
                if (
                    state[`${elementName}SocketOptions`].stopReceive
                    && state[`${elementName}Placemark`].id == 0
                    && nextProps.socketData[elementName][constants.socketServerResponses.FIND_PLACEMARK]
                ) {
                    newState[`${elementName}Placemark`] = {
                        ...state[`${elementName}Placemark`],
                        ...{
                            id: nextProps.socketData[elementName][constants.socketServerResponses.FIND_PLACEMARK].placemark.id,
                            coords: nextProps.socketData[elementName][constants.socketServerResponses.FIND_PLACEMARK].placemark.coords
                        }
                    };
                    newState[`${elementName}Value`] = nextProps.socketData[elementName][constants.socketServerResponses.FIND_PLACEMARK].placemark.name;
                    newState[`${elementName}Options`] = [];
                }
                //
            }

            // receive intermediate placemarks
            if (nextProps.socketData.intermediatePlacemarks && !state.intermediatePlacemarks) {
                newState.intermediatePlacemarks = nextProps.socketData.intermediatePlacemarks;
            }
            //

            if (Object.keys(newState).length > 0)
                return newState;
        }

        return null;
    }

    componentDidMount() {
        this.setMap();
        // console.dirxml(this);
    }

    componentDidUpdate() {
        let isAllPlacemarksSelected = true;
        for (const inputName of this.inputNames) {
            if ((this.state[`${inputName}Placemark`].id == 0) || (this.state[`${inputName}Placemark`].id == -1)) {
                isAllPlacemarksSelected = false;
                break;
            }
        }

        if (isAllPlacemarksSelected) {
            if (!this.state.intermediatePlacemarks)
                getIntermediatePlacemarks(this.state.fromPlacemark.id, this.state.toPlacemark.id);
            else
                this.resetMap();
        }
    }

    componentWillUnmount() {
        this.map.destroy();
    }
    /////////////////////////////////

    /////////////////////////////////
    // Events handlers

    handleCloseDialog() {
        this.setState({
            isDialogVisible: false
        });
    }

    handleDropDownInput(name, value, withProcessing = true) {
        value = value.trim();

        if (this.state[`${name}Value`] != value) {
            const newState = {
                [`${name}Value`]: value
            };

            if (withProcessing) {
                // set "stopReceive" flag on other inputs
                this.inputNames.forEach(inputName => {
                    newState[`${inputName}SocketOptions`] = this.state[`${inputName}SocketOptions`];
                    if (inputName != name)
                        newState[`${inputName}SocketOptions`].stopReceive = true;
                });
                //

                newState[`${name}Placemark`] = {
                    ...this.state[`${name}Placemark`],
                    ...{
                        id: -1
                    }
                };
                newState.intermediatePlacemarks = null;

                if (value) {    // request dropdown options
                    newState[`${name}SocketOptions`].requestCounter += 1;
                    newState[`${name}SocketOptions`].stopReceive = false;
                    getOptionsPlacemarks(name, newState[`${name}SocketOptions`].requestCounter, value);
                }
                else {          // dispose dropdown options
                    newState[`${name}SocketOptions`].stopReceive = true;
                    newState[`${name}Options`] = [];
                }
            }

            this.setState(newState);
        }
    }

    handleDropDownSelect(name, itemId) {
        let newState = {};

        newState.intermediatePlacemarks = null;

        // set "stopReceive" flag on all inputs
        this.inputNames.forEach(inputName => {
            newState[`${inputName}SocketOptions`] = this.state[`${inputName}SocketOptions`];
            newState[`${inputName}SocketOptions`].stopReceive = true;
        });
        //

        // handle id-s equality
        let isEqualToAnotherId = false;
        for (const inputName of this.inputNames) {
            if ((inputName != name) && (this.state[`${inputName}Placemark`].id == itemId)) {
                isEqualToAnotherId = true;

                newState = {
                    ...newState,
                    ...{
                        isDialogVisible: true,
                        dialogType: dialogTypes.ERROR,
                        dialogContent: "Пункты должны различаться."
                    }
                };

                break;
            }
        }

        if (!isEqualToAnotherId)
            newState[`${name}Placemark`] = {
                ...this.state[`${name}Placemark`],
                ...{
                    id: 0
                }
            };
        //

        newState[`${name}ValueSelectedFromOptions`] = true;

        findPlacemark(name, itemId);

        this.setState(newState);
    }

    /////////////////////////////////

    render() {
        return (
            <>
                {this.state.isDialogVisible &&
                    ReactDOM.createPortal(
                        <Dialog type={this.state.dialogType} onClose={this.handleCloseDialog}>
                            {this.state.dialogContent}
                        </Dialog>,
                        document.getElementById("modal"))
                }
                <div className="container">
                    <div className="row">
                        <label className="row__label" htmlFor="from">From:</label>
                        <div className="row__data">
                            <Input
                                name="from"
                                value={this.state.fromValue}
                                options={this.state.fromOptions}
                                onDropDownInputChange={this.handleDropDownInput}
                                onOptionsSelect={this.handleDropDownSelect} />
                        </div>
                    </div>
                    <div className="row">
                        <label className="row__label" htmlFor="to">To:</label>
                        <div className="row__data">
                            <Input
                                name="to"
                                value={this.state.toValue}
                                options={this.state.toOptions}
                                onDropDownInputChange={this.handleDropDownInput}
                                onOptionsSelect={this.handleDropDownSelect} />
                        </div>
                    </div>
                    <div className="padder"></div>
                    <div className="container__map" ref={this.mapContainer}></div>
                </div>
            </>
        );
    }

    /////////////////////////////////
    // Services

    setMap() {
        // hidden
    }

    resetMap() {
        // hidden
    }

    getMapBounds(firstCoords, secondCoords) {
        // hidden
    }

    handleMapcontainerClick(evt) {
        // hidden
    }
    /////////////////////////////////
}

const AppWithSocket = withSocket(App);

export { AppWithSocket as App }