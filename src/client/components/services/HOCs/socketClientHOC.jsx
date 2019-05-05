import React from "react";
import { socketDataSource } from "../../../../lib/socketClient/dataSourceConnector";
import * as constants from "../../../../lib/constants";

function withSocket(WrappedComponent) {

    class WithSocket extends React.Component {
        constructor(props) {
            super(props);

            // state will have structure like this:
            // this.state = {
            //      ...
            //
            //     elementName_1: {
            //          ...
            //     },
            //     elementName_2: {
            //          ...
            //     },
            //      ...
            // };

            //... but for now
            this.state = {
                recentlyElementName: ""
            };

            this.handleDataChange = this.handleDataChange.bind(this);
        }

        /////////////////////////////////
        // Lifecircles

        componentDidMount() {
            socketDataSource.addDataListener(WithSocket.displayName, this.handleDataChange);
        }

        componentWillUnmount() {
            socketDataSource.removeDataListener(this.handleDataChange);
        }
        /////////////////////////////////

        /////////////////////////////////
        // Events handlers

        handleDataChange(changeType, payload) {
            switch (changeType) {
                case constants.socketServerResponses.GET_OPTIONS_PLACEMARKS:
                    this.setState(
                        {
                            intermediatePlacemarks: null,
                            recentlyElementName: payload.elementName,
                            [payload.elementName]:
                            {
                                answerCounter: payload.answerCounter,
                                [constants.socketServerResponses.GET_OPTIONS_PLACEMARKS]: payload.data
                            }
                        }
                    );
                    break;

                case constants.socketServerResponses.FIND_PLACEMARK:
                    this.setState(
                        {
                            intermediatePlacemarks: null,
                            recentlyElementName: payload.elementName,
                            [payload.elementName]:
                            {
                                [constants.socketServerResponses.FIND_PLACEMARK]: payload.data
                            }
                        }
                    );
                    break;

                case constants.socketServerResponses.GET_ITERMEDIATE_PLACEMARKS:
                    this.setState(
                        {
                            recentlyElementName: null,
                            intermediatePlacemarks: payload.data.placemarks
                        }
                    );
                    break;

                default:
                    break;
            }
        }
        /////////////////////////////////

        render() {
            return (
                <WrappedComponent socketData={this.state} {...this.props} />
            );
        }
    }

    WithSocket.displayName = `WithSocket(${getDisplayName(WrappedComponent)})`;

    return WithSocket;
}

function getDisplayName(WrappedComponent) {
    return WrappedComponent.displayName || WrappedComponent.name || "Component";
}


export { withSocket }