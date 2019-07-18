// @flow
import React, { Component } from 'react';
import HomeView from './Home-view.js';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as CounterActions from '../../actions/counter';

type Props = {};

class Home extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <HomeView
        changeCalculatorMethod={this.props.changeCalculatorMethod}
        calculatorMethodChoosed={this.props.counter.methodUsed}
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
)(Home);
