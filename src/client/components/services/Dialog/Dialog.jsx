import React from "react";
import PropTypes from "prop-types";

import "./Dialog.scss";
import * as closeIcon from "../../../assets/images/clear-24px.svg";

const dialogTypes = {
    ERROR: "ERROR",
    WARNING: "WARNING",
    INFO: "INFO"
};


class Dialog extends React.Component {
    constructor(props) {
        super(props);

        this.parentElement = document.getElementById("modal");

        this.handleClose = this.handleClose.bind(this);

        this.makeDialogVisible();
    }

    /////////////////////////////////
    // Events handlers

    handleClose() {
        const readyToUnmount = () => {
            this.parentElement.removeEventListener("transitionend", readyToUnmount);
            this.parentElement.classList.remove("visible");
            this.parentElement.classList.remove("fadeOut");
            this.props.onClose();
        }

        this.parentElement.addEventListener("transitionend", readyToUnmount);
        this.parentElement.classList.add("fadeOut");
    }
    /////////////////////////////////

    render() {
        const hrStyle = (this.props.type == dialogTypes.ERROR) ? "error" :
            (this.props.type == dialogTypes.WARNING) ? "warning" : "info";

        return (
            <div className="dialog">
                <div className="dialog__caption">
                    <img src={closeIcon} alt="close" onClick={this.handleClose} />
                </div>
                <div className={`hr ${hrStyle}`}></div>
                <div className="dialog__content">{this.props.children}</div>
            </div>
        );
    }

    /////////////////////////////////
    // Services

    makeDialogVisible() {
        this.parentElement.classList.add("visible");
    }
    /////////////////////////////////
}

Dialog.propTypes = {
    type: PropTypes.string,
    onClose: PropTypes.func.isRequired
};

Dialog.defaultProps = {
    type: dialogTypes.INFO
};

export {
    Dialog,
    dialogTypes
}