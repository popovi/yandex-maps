import React from "react";
import PropTypes from "prop-types";

import "./Input.scss";

class Input extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isOptionsOpen: false
        };

        this.optionsListRef = React.createRef();

        this.handleOptionsClick = this.handleOptionsClick.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
    }

    /////////////////////////////////
    // Events handlers

    handleOptionsClick(evt) {
        const li = evt.target.closest("li");
        if (!li) return;

        if (!this.optionsListRef.current.contains(li))
            return;

        this.props.onOptionsSelect(this.props.name, li.dataset.id);
    }

    handleInputChange(evt) {
        this.props.onDropDownInputChange(evt.target.name, evt.target.value);
    }
    /////////////////////////////////

    render() {
        const options = this.props.options.map(item => <li key={item.id} data-id={item.id}>{item.name}</li>);
        const optionsOpenStyle = options.length > 0 ? "open" : "";

        return (
            <div className="dropDownContainer" tabIndex="-1">
                <div className="input_text_container">
                    <input type="text" name={this.props.name} value={this.props.value} onChange={this.handleInputChange} />
                </div>
                <div className={`optionsContainer ${optionsOpenStyle}`}>
                    <ul ref={this.optionsListRef} onClick={this.handleOptionsClick}>{options}</ul>
                </div>
            </div>
        );
    }

}

Input.propTypes = {
    name: PropTypes.string.isRequired,
    value: PropTypes.string,
    options: PropTypes.arrayOf(PropTypes.object),
    onDropDownInputChange: PropTypes.func.isRequired,
    onOptionsSelect: PropTypes.func.isRequired
};

export { Input }