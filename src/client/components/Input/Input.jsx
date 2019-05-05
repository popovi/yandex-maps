import React from "react";
import PropTypes from "prop-types";

import "./Input.scss";

class Input extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            optionsSelectedItemIndex: -1
        };

        this.optionsListRef = React.createRef();

        this.handleOptionsClick = this.handleOptionsClick.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleInputKeyDown = this.handleInputKeyDown.bind(this);
    }

    /////////////////////////////////
    // Lifecircles

    componentDidUpdate(prevProps) {
        if ((prevProps.options.length > 0) && (this.props.options.length == 0))
            this.setState({ optionsSelectedItemIndex: -1 });
    }
    /////////////////////////////////

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

    handleInputKeyDown(evt) {
        switch (evt.keyCode) {
            case 40:    // down
                this.setOptionsSelectedItem(evt.target.name, 1);
                evt.preventDefault();
                break;

            case 38:    // up
                this.setOptionsSelectedItem(evt.target.name, -1);
                evt.preventDefault();
                break;

            case 13:    // enter
                this.selectOptionsItem(evt.target.name);
                evt.preventDefault();
                break;

            default:
                break;
        }
    }
    /////////////////////////////////

    render() {
        const options = this.props.options.map((item, index) => {
            const liStyle = (index == this.state.optionsSelectedItemIndex) ? "current" : "";
            return (
                <li key={item.id} className={liStyle} data-id={item.id}>{item.name}</li>
            );
        });
        const optionsOpenStyle = options.length > 0 ? "open" : "";

        return (
            <div className="dropDownContainer" tabIndex="-1">
                <div className="input_text_container">
                    <input
                        type="text"
                        name={this.props.name}
                        value={this.props.value}
                        onChange={this.handleInputChange}
                        onKeyDown={this.handleInputKeyDown} />
                </div>
                <div className={`optionsContainer ${optionsOpenStyle}`}>
                    <ul ref={this.optionsListRef} onClick={this.handleOptionsClick}>{options}</ul>
                </div>
            </div>
        );
    }

    /////////////////////////////////
    // Services

    setOptionsSelectedItem(inputName, step) {
        const { options } = this.props;

        if (options.length > 0) {
            const maxIndex = options.length - 1;
            let nextSelectedItemIndex = this.state.optionsSelectedItemIndex + step;
            if (nextSelectedItemIndex < 0) nextSelectedItemIndex = 0;
            else if (nextSelectedItemIndex > maxIndex) nextSelectedItemIndex = maxIndex;

            this.setState({ optionsSelectedItemIndex: nextSelectedItemIndex });
            this.props.onDropDownInputChange(inputName, options[nextSelectedItemIndex].name, false);
        }
    }

    selectOptionsItem(inputName) {
        this.props.onOptionsSelect(inputName, this.props.options[this.state.optionsSelectedItemIndex].id);
    }
    /////////////////////////////////
}

Input.propTypes = {
    name: PropTypes.string.isRequired,
    value: PropTypes.string,
    options: PropTypes.arrayOf(PropTypes.object),
    onDropDownInputChange: PropTypes.func.isRequired,
    onOptionsSelect: PropTypes.func.isRequired
};

export { Input }