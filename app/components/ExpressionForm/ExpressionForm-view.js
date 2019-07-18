import React, { Component } from 'react';
import { Row, Col, InputNumber, Input, Button, Select } from 'antd';
const InputGroup = Input.Group;
const { Option } = Select;
import styles from './ExpressionForm.css';

export default class ExpressionFormView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      minVal: this.props.minVal,
      maxVal: this.props.maxVal,
      expression: this.props.expression
    };
  }
  changeMin = minVal => {
    this.setState({ minVal: minVal.target.value });
  };
  changeMax = maxVal => {
    this.setState({ maxVal: maxVal.target.value });
  };
  changeExpression = expression => {
    this.setState({ expression: expression.target.value });
  };
  render() {
    return (
      <div>
        <Row type="flex" justify="space-between">
          <Col span={24}>
            <Input
              size="large"
              addonBefore="Equation"
              placeholder="Type the equation here"
              allowClear
              defaultValue={this.state.expression}
              onChange={this.changeExpression}
            />
          </Col>
        </Row>
        <Row type="flex" justify="space-between" className={styles.rowWithMargin}>
          <Col span={24}>
            <InputGroup compact size={'large'}>
              <Input
                addonBefore="Between"
                className={styles.hiddenInput}
                style={{
                  width: 100
                }}
                placeholder=""
                disabled
              />
              <Input
                className={styles.rangeInput}
                placeholder="Minimum"
                type={'number'}
                defaultValue={this.state.minVal}
                onChange={this.changeMin}
              />
              <Input
                style={{
                  width: 32
                }}
                className={styles.hiddenInput}
                placeholder="~"
                disabled
              />
              <Input
                className={styles.rangeInput}
                style={{ borderLeft: 0 }}
                placeholder="Maximum"
                type={'number'}
                defaultValue={this.state.maxVal}
                onChange={this.changeMax}
              />
            </InputGroup>
          </Col>
        </Row>
        <Row className={styles.rowWithMargin}>
          <Col span={18}>
            <p className={styles.equationString}>f(x)={this.props.expression.replace(/x/gi, "(x)")}</p>
          </Col>
          <Col span={6}>
            <Button
              type="primary"
              size={'large'}
              style={{ float: 'right' }}
              onClick={() => {
                this.props.changeEquation({
                  expression: this.state.expression,
                  minVal: this.state.minVal,
                  maxVal: this.state.maxVal
                });
              }}
            >
              Compute
            </Button>
          </Col>
        </Row>
      </div>
    );
  }
}
