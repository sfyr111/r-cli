import React, { ChangeEvent } from 'react'
import { RouteComponentProps } from 'react-router'

import SearchComponent from '../search-component/search-compont'

import { fetchSaleBill } from '../../shared/api/package'
import jsCookie from 'js-cookie'
import { Toast } from 'antd-mobile'

interface IProps extends RouteComponentProps {}

interface IState {
  inputContent: string
}

class OrderSearch extends React.PureComponent<IProps, IState> {
  state = {
    inputContent: '',
  }

  constructor(props: IProps) {
    super(props)
  }

  componentDidMount() {
    document.title = '订单号输入'
    window.kwapp && window.kwapp.setTitle('订单号输入')
  }

  getSearchData = async (content?: string) => {
    // console.log(inputContent)
    if (!content) {
      if (!this.state.inputContent) {
        Toast.fail('请输入正确的订单号！')
        return
      }
    }

    Toast.loading('订单查询中')
    const res = await fetchSaleBill({
      mtenantId: jsCookie.get('_platform_num'), // 租户号
      deptCode: jsCookie.get('deptCode'), // 部门编码
      billNumber: this.state.inputContent || content, // 单据号
    }) // 参数传递
    Toast.hide()
    console.log(res)
    if (res.code !== '0') {
      Toast.fail(res.msg)
      return
    }
    this.props.history.push(`/m/lsgc/write-off/order-detail?billNumber=${this.state.inputContent || content}`)
  }

  handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    this.setState({
      inputContent: e.target.value,
    })
  }

  scan = (item: any) => {
    window.kwapp &&
      window.kwapp.scanQr({
        callback: (result: any) => {
          console.log(result)
          this.setState({
            inputContent: result,
          })
          this.getSearchData(result)
        },
      })
  }

  render() {
    return (
      <SearchComponent scan={this.scan} inputContent={this.state.inputContent} handleChange={this.handleChange} getSearchData={this.getSearchData} placeholder="请输入订单号" />
    )
  }
}

export default OrderSearch
