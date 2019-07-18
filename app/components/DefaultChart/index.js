import React, { Component } from "react";
import DefaultChartView from "./DefaultChart-view.js";
import { bindActionCreators } from "redux";
import * as CounterActions from "../../actions/counter";
import { connect } from "react-redux";
import { message } from "antd";
import Tokenizer from "./helpers/tokenizer";
import evaluator from "./helpers/evaluator";
import FunctionPlotter from "./helpers/plotter";
import { evaluate } from "mathjs";

let tokenizer = new Tokenizer();

class DefaultChart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      canvasWidth: 400,
      canvasHeight: 300,
      plotContainer: "plot",
      resultContainer: "textResult"
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

  tokenizeEquation = () => {
    let tokens = tokenizer.tokenize(this.props.counter.expression);
    if (tokens.error) {
      if (tokens.message) {
        message.error(tokens.message);
      } else {
        message.error("Something went wrong!");
      }
      return false;
    }
    return tokens.structure;
  };

  replaceVariableInExpression = (expressionTokens, value) => {
    let rebuiltExpression = Object.assign([...expressionTokens]);
    rebuiltExpression.forEach((item, key) => {
      if (item.type === "variable") {
        rebuiltExpression[key].value = value;
      }
    });
    return rebuiltExpression;
  };

  evaluateTokenizedEquation = tokens => {
    let results = [];
    let resultReturned = {};
    let resultReturnedMathjs = {};
    let step = this.props.counter.minVal;
    let valScale = (this.props.counter.maxVal - this.props.counter.minVal) / this.state.canvasWidth;
    while (step < this.props.counter.maxVal) {
      resultReturned = evaluator(this.replaceVariableInExpression(tokens, step)).result;
      resultReturnedMathjs = evaluate(this.props.counter.expression.replace(/x/gi, step));
      // START testing purposes
      // if (resultReturned !== resultReturnedMathjs && typeof resultReturnedMathjs !== "object") {
      // console.error("Expression: " + this.props.counter.expression.replace(/x/gi, step));
      // console.error("Default engine: " + resultReturned);
      // console.error("MathJS engine: " + resultReturnedMathjs);
      // }
      // END testing purposes
      results.push({ x: step, y: resultReturned });
      step += valScale;
    }
    resultReturned = evaluator(this.replaceVariableInExpression(tokens, this.props.counter.maxVal)).result;
    results.push({
      x: this.props.maxVal,
      y: resultReturned
    });
    return results;
  };

  drawGraph = () => {
    let tokens = this.tokenizeEquation();
    if (tokens === false) {
      return;
    }
    let results = this.evaluateTokenizedEquation(tokens);
    let Plotter = new FunctionPlotter({
      data: results,
      container: this.state.plotContainer,
      textContainer: this.state.resultContainer
    });
    Plotter.draw();
  };

  render() {
    return (
      <div>
        <DefaultChartView
          canvasId={this.state.plotContainer}
          canvasWidth={this.state.canvasWidth}
          canvasHeight={this.state.canvasHeight}
          textContainerId={this.state.resultContainer}
        />
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
)(DefaultChart);
