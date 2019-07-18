// @flow
import React, { Component } from 'react';
import { Layout, Menu, Breadcrumb } from 'antd';
import ExpressionForm from '../../components/ExpressionForm';
import styles from './Home.css';
import DefaultChart from '../../components/DefaultChart';
import WolframPlot from '../../components/WolframPlot';

const { Header, Content, Footer } = Layout;

export default class HomeView extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <Layout className="layout">
        <Header>
          <div className={styles.logo}>CALCULATOR</div>
          <Menu
            theme="dark"
            mode="horizontal"
            defaultSelectedKeys={['default']}
            onSelect={item => {
              this.props.changeCalculatorMethod(item.key);
            }}
            style={{ lineHeight: '64px' }}
          >
            <Menu.Item key="default">Default parser</Menu.Item>
            <Menu.Item key="wolfram">WolframAlpha</Menu.Item>
          </Menu>
        </Header>
        <Content style={{ padding: '0 50px' }}>
          <div style={{ background: '#fff', padding: 24, minHeight: 'calc(100vh - 175px)', marginTop: 40 }}>
            <ExpressionForm />
            {this.props.calculatorMethodChoosed === 'default' ? <DefaultChart /> : <WolframPlot />}
          </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>GXB ©2019 Created by Stefan Macovei</Footer>
      </Layout>
    );
  }
}
