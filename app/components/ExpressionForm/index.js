import React, { Component } from "react";
import ExpressionFormView from "./ExpressionForm-view.js";
import { bindActionCreators } from "redux";
import * as CounterActions from "../../actions/counter";
import { connect } from "react-redux";
import { message } from "antd";

class ExpressionForm extends Component {
  constructor(props) {
    super(props);
  }
  changeEquation = obj => {
    if (!obj.expression) {
      return message.error("Please complete the equation field!");
    }
    if (isNaN(obj.minVal) || isNaN(obj.maxVal)) {
      return message.error("Please complete the range fields!");
    }
    this.props.changeEquation(obj);
  };
  render() {
    return (
      <ExpressionFormView
        changeEquation={this.changeEquation}
        expression={this.props.counter.expression}
        minVal={this.props.counter.minVal}
        maxVal={this.props.counter.maxVal}
      />
    );
  }
}
function mapStateToProps(state) {
  return {
    counter: state.counter
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(CounterActions, dispatch);
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ExpressionForm);
