import React, { FunctionComponent, memo, useEffect, useState } from 'react'
import { RouteComponentProps } from 'react-router'
import qs from 'qs'

import './cash-result.styl'

import Result from '../../component/result/result'
import { genQueryStringForObj, getQueryObjForSearch, goHome, publicPath } from '../../shared/script/utils'

interface IProps extends RouteComponentProps {}

const CashResult: FunctionComponent<IProps> = memo((props: IProps) => {
  const {
    match: { params },
    location: { search },
  } = props

  const { billNumber, rewriteoff } = getQueryObjForSearch(search)
  console.log(billNumber)
  const [pageStatus, setPageState] = useState(0)
  const { status = '0' } = qs.parse(search, { ignoreQueryPrefix: true })

  useEffect(() => {
    const title = status === '1' ? '支付结果' : '支付失败'
    document.title = title
    window.kwapp && window.kwapp.setTitle(title)

    setPageState(Number(status))
  }, [status])

  const successActiveData = [
    ...(rewriteoff === '1'
      ? [{ text: '继续核销', type: 'primary', handle: () => props.history.push(`${publicPath()}/order-detail?billNumber=${billNumber}&from=payResult`) }]
      : [{ text: '返回首页', type: 'default', handle: () => goHome() }]),
  ]
  const errorActiveData = [
    { text: '返回首页', type: 'default', handle: () => goHome() },
    {
      text: '重新支付',
      type: 'primary',
      handle: () => {
        const queryObj = getQueryObjForSearch(location.search)
        const queryString = genQueryStringForObj({ ...queryObj, status: undefined })
        props.history.push(`${publicPath()}/cash${queryString}`)
      },
    },
  ]

  return (
    <div className="cash-result">
      <div className="cash-result__container">
        {!!pageStatus ? (
          <Result status="success" successMsg="支付成功" activeData={successActiveData} />
        ) : (
          <Result status="error" errorMsg="支付失败" activeData={errorActiveData} />
        )}
      </div>
    </div>
  )
})

CashResult.defaultProps = {}

export default CashResult
