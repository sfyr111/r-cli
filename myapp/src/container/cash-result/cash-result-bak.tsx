import React from 'react'
import { RouteComponentProps } from 'react-router'
import qs from 'qs'
// import * as R from 'ramda'

import './cash-result.styl'
import { connect } from 'react-redux-immutable'

import Result from '../../component/result/result'
// import { fixAndroidText, isAndroid, isIPhoneX, isIPhoneXR, isIPhoneXSMax } from "../../shared/script/utils";

interface IProps extends RouteComponentProps {}

interface IState {
  status: number
}

@(connect((state: any) => ({}), {}) as any)
class CashResultBak extends React.PureComponent<IProps, IState> {
  static defaultProps: IProps

  state = {
    status: 0,
  }

  componentDidMount() {
    document.title = '支付结果'
    window.kwapp && window.kwapp.setTitle('支付结果')
    const {
      match: { params },
      location: { search },
    } = this.props
    const { status = 0 } = qs.parse(search, { ignoreQueryPrefix: true })
    this.setState({ status: Number(status) })
  }

  render() {
    const {} = this.props
    const { status } = this.state

    return (
      <div className="cash-result">
        <div className="cash-result__container">
          {!!status ? (
            <Result status="success" successMsg="支付成功" activeData={[{ text: '返回首页', type: 'default', handle: () => console.log('返回首页') }]} />
          ) : (
            <Result
              status="error"
              errorMsg="支付失败"
              activeData={[
                { text: '返回首页', type: 'default', handle: () => console.log('返回首页') },
                { text: '重新支付', type: 'primary', handle: () => console.log('重新支付') },
              ]}
            />
          )}
        </div>
      </div>
    )
  }
}

export default CashResultBak
