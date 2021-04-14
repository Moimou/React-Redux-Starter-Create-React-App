import React, { Component } from "react";

class SearchBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchText: "",
      placeHolder: " Tapez votre film...",
      lockRequest: false,
      intervalBeforeRequest: 1000,
    };
  }
  render() {
    return (
      <div className="row">
        <div className="col-md-8">
          <input
            type="text"
            className="form-control input-lg"
            onKeyUp={this.handleOnChange.bind(this)}
            placeholder={this.state.placeHolder}
          />
        </div>
        <span className="input-group-button">
          <button
            className="btn btn-secondary"
            onClick={this.handleOnclick.bind(this)}
          >
            GO
          </button>
        </span>
      </div>
    );
  }

  handleOnChange(event) {
    this.setState({
      searchText: event.target.value,
    });
    if (!this.state.lockRequest) {
      this.setState({ lockRequest: true });
      setTimeout(
        function () {
          this.search();
        }.bind(this),
        this.state.intervalBeforeRequest
      );
    }
  }

  handleOnclick() {
    this.search();
  }

  search() {
    this.props.callBack(this.state.searchText);
    this.setState({ lockRequest: false });
  }
}

export default SearchBar;
