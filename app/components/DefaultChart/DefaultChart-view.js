import React, { Component } from 'react';
import { Col, Row } from 'antd';
import styles from './DefaultChart.css';
export default class DefaultChartView extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div>
        <Row className={styles.content}>
          <Col span={24} id={this.props.textContainerId}>
              Write an equation and select the range.
              <br/>
            Click compute and drag over the chart.
          </Col>
        </Row>
        <Row className={styles.graph}>
          <Col span={24}>
            <canvas id={this.props.canvasId} width={this.props.canvasWidth} height={this.props.canvasHeight} />
          </Col>
        </Row>
      </div>
    );
  }
}
