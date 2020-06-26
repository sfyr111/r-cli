import React from 'react'
import { RouteComponentProps } from 'react-router'
import { WhiteSpace, Button } from 'antd-mobile'

import './test-page.styl'
import { connect } from 'react-redux-immutable'
import { fetchPaymentList } from '../cash/store/api'
import { startPollSaga, stopPollSaga } from './store/test-page.action'
import { genCashSignStr } from '../../shared/script/utils'
import jsCookie from 'js-cookie'

const md5 = require('md5')

interface IProps extends RouteComponentProps {
  startPollSaga: () => void
  stopPollSaga: () => void
}

interface IState {
  scanText: any
}

const params: { [key: string]: any } = {
  _platform_num: 11111,
  deptCode: 10001,
  cashierCode: 9999,
  detail: {
    uid: 101010,
    code: '39494302013',
  },
}

const keys = Object.keys(params).sort()
const sign = 'bbcashier'
// const sign = ''
const formatParams =
  sign +
  keys.reduce((pre: string, cur: string) => {
    if (typeof params[cur] === 'object') {
      pre += cur + JSON.stringify(params[cur])
    } else {
      pre += cur + String(params[cur])
    }
    return pre
  }, '')
const md5Parmas = md5(formatParams)

@(connect((state: any) => ({}), {
  startPollSaga,
  stopPollSaga,
}) as any)
class TestPage extends React.PureComponent<IProps, IState> {
  static defaultProps: IProps

  state = {
    scanText: '',
  }

  async componentDidMount() {
    document.title = 'test-page'
    window.kwapp && window.kwapp.setTitle('test-page')
    const params = {
      timestamp: Date.now(),
      _platform_num: jsCookie.get('_platform_num'),
    }
    const sign = genCashSignStr(params)
    await fetchPaymentList({ ...params, sign })

    const d = await this.proms()
    console.log('d: ', d)
  }

  componentWillUnmount() {}

  scan = () => {
    window.kwapp &&
      window.kwapp.scanQr({
        callback: (result: any) => {
          console.log(result)
          this.setState({ scanText: result })
        },
      })
  }

  proms = () => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(1)
      }, 1000)
    }).then()
  }

  render() {
    return (
      <div className="test-page">
        <section className="test-page__container">
          <WhiteSpace size="lg" />
          <p>扫码内容: {this.state.scanText}</p>
          <Button onClick={this.scan}>扫码</Button>

          <WhiteSpace size="lg" />
          <p>md5 加密</p>
          <code>{JSON.stringify(params, null, 2)}</code>

          <WhiteSpace size="lg" />
          <span>加密内容: {formatParams}</span>
          <WhiteSpace size="lg" />
          <span>md5: {md5Parmas}</span>

          <WhiteSpace size="lg" />
          <Button onClick={this.props.startPollSaga}>开始轮询</Button>
          <Button onClick={this.props.stopPollSaga}>结束轮询</Button>

          <WhiteSpace size="lg" />
        </section>
      </div>
    )
  }
}

export default TestPage
