import React from 'react'
import { Checkbox, Modal, Toast } from 'antd-mobile'
import { RouteComponentProps } from 'react-router'
import './cash.styl'
import { connect } from 'react-redux-immutable'
import { getPaymentListSaga, loadCashierSaga, prePaySaga, unityPaySaga } from './store/cash.action'
import { cash } from './store/cash.reducer'
import { formatCents, genQueryStringForObj, getQueryObjForSearch, publicPath } from '../../shared/script/utils'
import BigNumber from 'bignumber.js'
import jsCookie from 'js-cookie'
import qs from 'qs'
// import { fixAndroidText, isAndroid, isIPhoneX, isIPhoneXR, isIPhoneXSMax } from "../../shared/script/utils";

interface IProps extends RouteComponentProps<any> {
  loadCashierSaga: (params: any) => void
  getPaymentListSaga: () => void
  prePaySaga: (params: any) => void
  unityPaySaga: () => void
  cashInfo: { [ext: string]: any }
  billInfo: { [ext: string]: any }
  cashMethods: any[]
}

interface IState {
  selectedMethod: {
    interFaceCategoryCode: string
    paymentCode: string
  }
}

const prompt = Modal.prompt
const CheckboxItem = Checkbox.CheckboxItem

const INTERFACE_CATEGORY_CODE_LS_HV_YU_E = '3167'
const INTERFACE_CATEGORY_CODE_XM_JN = 'XJ'
const INTERFACE_CATEGORY_CODE_WEI_XIN = '3002'
const INTERFACE_CATEGORY_CODE_VI_FU_BK = '3001'
const INTERFACE_CATEGORY_CODE_GS_HV_KA = '2015'

const payFlowMap: any = {
  [INTERFACE_CATEGORY_CODE_LS_HV_YU_E]: {
    needScan: false,
    buildScanParams: (params?: any) => ({}),
    buildBillInfoParams: (params?: any) => ({}),
  },
  [INTERFACE_CATEGORY_CODE_XM_JN]: {
    needScan: false,
    buildScanParams: (params?: any) => ({}),
    buildBillInfoParams: (params?: any) => ({}),
  },
  [INTERFACE_CATEGORY_CODE_WEI_XIN]: {
    needScan: true,
    buildScanParams: (params?: any) => {
      return !!params ? { authCode: params } : {}
    },
    buildBillInfoParams: (params?: any) => ({}),
  },
  [INTERFACE_CATEGORY_CODE_VI_FU_BK]: {
    needScan: true,
    buildScanParams: (params?: any) => {
      return !!params ? { authCode: params } : {}
    },
    buildBillInfoParams: (params?: any) => ({}),
  },
  [INTERFACE_CATEGORY_CODE_GS_HV_KA]: {
    needScan: true,
    buildScanParams: (params?: any) => {
      if (!params) return { trk2: '', password: '', cardInCode: '' }
      try {
        const { Cd_Number = '', Cd_MtNumber = '', Gu_Id = '' } = JSON.parse(params)
        return { trk2: Cd_MtNumber, password: Gu_Id, cardInCode: Cd_Number }
      } catch (e) {
        return { trk2: '', password: '', cardInCode: '' }
      }
    },
    buildBillInfoParams: (params?: any) => {
      const { vecMutiTradeDdo } = params
      return {
        goodsAttribute: vecMutiTradeDdo
          .map((item: any) => `${item.tradeId}|${item.itemTitle}|${item.tradeNum}|${item.itemBrandId}|${item.itemClassId}||${item.tradeDiscountPayment}`)
          .join(','),
      }
    },
  },
}

@(connect(
  (state: any) => ({
    billInfo: state.getIn(['cash', 'billInfo']),
    cashInfo: state.getIn(['cash', 'cashInfo']),
    cashMethods: state.getIn(['cash', 'cashMethods']),
  }),
  { loadCashierSaga, getPaymentListSaga, prePaySaga, unityPaySaga }
) as any)
class Cash extends React.PureComponent<IProps, IState> {
  state = {
    checked: true,
    selectedMethod: { interFaceCategoryCode: '', paymentCode: '' },
  }

  componentDidMount() {
    document.title = '收银台'
    window.kwapp && window.kwapp.setTitle('收银台')
    const {
      location: { search },
      match: { params },
    } = this.props
    const { billNumber, money, subBillNumber, subPrice } = getQueryObjForSearch(search)
    this.props.loadCashierSaga({ billNumber, money, subBillNumber, subPrice })
    this.props.getPaymentListSaga()
  }

  onChange = (val: any) => {
    this.setState({
      selectedMethod: val,
    })
  }

  payActive = () => {
    if (jsCookie.get('deptCode') === '000') return Toast.fail('员工无操作权限', 0.8)
    const { selectedMethod } = this.state

    const currentPaymentType = payFlowMap[selectedMethod.interFaceCategoryCode]

    console.log('currentPaymentType: ', currentPaymentType)
    if (!currentPaymentType) return Toast.info('请选择支付方式', 0.8)
    this.promptPay()
  }

  promptPay = () => {
    const { cashInfo } = this.props
    prompt(
      '输入支付金额',
      '',
      [
        { text: '取消' },
        {
          text: '确定',
          onPress: (value: any) => this.activePay(value),
        },
      ],
      'default',
      String(formatCents(cashInfo.unpaidMoney)),
      ['输入支付金额']
    )
  }

  activePay = async (value: string) => {
    const { billInfo, cashInfo, prePaySaga } = this.props
    const { selectedMethod } = this.state

    const currentPaymentType = payFlowMap[selectedMethod.interFaceCategoryCode]

    console.log('currentPaymentType: ', currentPaymentType)
    const { needScan, buildScanParams, buildBillInfoParams } = currentPaymentType

    try {
      const scanInfo = await this.scan(needScan)
      console.log('scanInfo: ', scanInfo)
      const unityExtParams = { ...buildScanParams(scanInfo), ...buildBillInfoParams(billInfo) }
      console.log('unityExtParams: ', unityExtParams)

      const preParams = {
        paynumber: cashInfo.paynumber,
        salePaymentDetail: {
          interFaceCategoryCode: selectedMethod.interFaceCategoryCode,
          paymentCode: selectedMethod.paymentCode,
          paymentMoney: new BigNumber(value).multipliedBy(100).toNumber(), // 分
          cardCode: '',
        },
      }
      prePaySaga({ preParams, unityExtParams })
    } catch (e) {
      console.error(e)
      Toast.fail(`扫码失败: ${e.message}`, 1)
    }
  }

  scan = (needScan: boolean) => {
    return new Promise((resolve, reject) => {
      if (!needScan) {
        return resolve('')
      }
      window.kwapp &&
        window.kwapp.scanQr({
          callback: (result: any) => {
            console.log('scan: ', result)
            return resolve(result)
          },
        })
    })
  }

  render() {
    const { cashInfo, cashMethods } = this.props
    const { selectedMethod } = this.state

    return (
      <div className="cash">
        <div className="cash__container">
          <div className="cash__pay-info">
            <div className="cash__pay-info--details">
              <section className="details__item">
                <p>应付金额:</p>
                <span>+￥{formatCents(cashInfo.saleMoney)}</span>
              </section>
              <section className="details__item">
                <p>已付金额:</p>
                <span>-￥{formatCents(cashInfo.paidMoney)}</span>
              </section>
            </div>
            <div className="cash__pay-info--total">
              <section className="total">
                <p>实际付款:</p>
                <span>￥{formatCents(cashInfo.unpaidMoney)}</span>
              </section>
            </div>
          </div>
          <div className="cash__pay-method">
            <div className="cash__pay-method--item">
              {cashMethods.length > 0 &&
                cashMethods.map(
                  (item: any) =>
                    !!~Object.keys(payFlowMap).indexOf(item.interFaceCategoryCode) && (
                      <CheckboxItem key={item.paymentName} checked={selectedMethod.interFaceCategoryCode === item.interFaceCategoryCode} onChange={() => this.onChange(item)}>
                        <div className="cell">
                          <section>
                            {/*<img src={require(`../../images/${item.paymentName}.png`)} alt="" />*/}
                            <img src={require(`../../images/cash-icon@${item.interFaceCategoryCode}.png`)} alt="" />
                            <span>{item.paymentName}</span>
                          </section>
                          {selectedMethod.interFaceCategoryCode === item.interFaceCategoryCode && <span>支付{formatCents(cashInfo.unpaidMoney)}元</span>}
                        </div>
                      </CheckboxItem>
                    )
                )}
            </div>
          </div>

          <div className="cash__submit">
            {/*<a className="btn" onClick={() => this.props.history.push('/m/lsgc/write-off/cash-result')}>确认支付</a>*/}
            <a className="btn" onClick={this.payActive}>
              确认支付
            </a>
          </div>
        </div>
      </div>
    )
  }
}

export default Cash
