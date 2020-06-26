import api from '../../../shared/api/service'
import url from '../../../shared/api/apiUrl'

interface ITimestampSign {
  timestamp: string | number
  sign: string
}

// 加载支付列表
export const fetchPaymentList = (params: any) => api.get(url.getPaymentList, params)

// 加载收银台
export const fetchLoadCashier = (params: any) => api.post(url.loadCashier, params, { isJson: true })

// 加载收银台
export const fetchBillInfo = (params: any) => api.get(url.getFatherSaleBill, params, { isJson: true })

// 预支付
export const fetchPrePayList = (params: any) => api.post(url.prePayList, params, { isJson: true })

// 统一支付
export const fetchTongyizhifu = (params: any) => api.post(url.tongyizhifu, params, { isJson: true })

// 支付回写
export const fetchPaidBackWrite = (params: any) => api.post(url.paidBackWrite, params, { isJson: true })

// 支付上报
export const fetchReportPayment = (params: any) => api.post(url.reportPayment, params, { isJson: true })

// 取消支付
export const fetchCancelNormalPay = ({ timestamp, sign }: any) => api.post(url.cancelNormalPay, { timestamp, sign }, { isJson: true })
