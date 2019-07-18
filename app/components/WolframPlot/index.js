import React, { Component } from "react";
import WolframPlotView from "./WolframPlot-view.js";
import { bindActionCreators } from "redux";
import * as CounterActions from "../../actions/counter";
import { connect } from "react-redux";
import wolframSdk from "wolfram-alpha";
import { wolframAppId } from "../../configs";

const wolfram = wolframSdk.createClient(wolframAppId, {});

class WolframPlot extends Component {
  constructor(props) {
    super(props);
    this.state = {
      imageUrl: "",
      isLoading: false
    };
  }

  componentDidMount() {
    if (this.verifyInputData()) {
      this.drawGraph();
    }
  }

  componentDidUpdate(oldProps) {
    let recalculateWhenChanged = ["method", "expression", "minVal", "maxVal"];
    let recalculateNeeded = false;
    recalculateWhenChanged.forEach(item => {
      if (oldProps.counter[item] !== this.props.counter[item]) {
        recalculateNeeded = true;
      }
    });
    if (recalculateNeeded) {
      this.drawGraph();
    }
  }

  verifyInputData = () => {
    return !(!this.props.counter.expression || isNaN(this.props.counter.minVal) || isNaN(this.props.counter.maxVal));
  };

  prepareWolframQuery = () => {
    return (
      "plot " +
      this.props.counter.expression.replace(/x/gi, "(x)") +
      " from " +
      this.props.counter.minVal +
      " to " +
      this.props.counter.maxVal
    );
  };

  drawGraph = async () => {
    this.setState({ isLoading: true });
    let results = await wolfram.query(this.prepareWolframQuery());
    let imageFound = "";
    results.forEach(item => {
      if (item.title === "Plot") {
        imageFound = item.subpods[0].image;
      }
    });
    if (imageFound) {
      this.setState({ imageUrl: imageFound, isLoading: false });
    }
  };

  render() {
    return (
      <div>
        <WolframPlotView imageUrl={this.state.imageUrl} isLoading={this.state.isLoading} />
      </div>
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
)(WolframPlot);
