import React, { Component } from 'react';
import { Col, Row, Spin } from 'antd';
import styles from './WolframPlot.css';
export default class DefaultChartView extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div>
        <Row className={styles.graph}>
          <Col span={24} className={styles.bringToCenter}>
            {this.props.isLoading ? <Spin /> : <img src={this.props.imageUrl} />}
          </Col>
        </Row>
      </div>
    );
  }
}
