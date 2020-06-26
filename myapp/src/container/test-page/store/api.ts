import api from '../../../shared/api/service'
import url from '../../../shared/api/apiUrl'

interface ITimestampSign {
  timestamp: string | number
  sign: string
}

// 加载支付列表
export const fetchPaymentList = (params: any) => api.get(url.getPaymentList, params)

// 加载收银台
export const fetchLoadCashier = ({ timestamp, sign }: any) => api.post(url.loadCashier, { timestamp, sign }, { isJson: true })

// 预支付
export const fetchPrePayList = ({ timestamp, sign }: any) => api.post(url.prePayList, { timestamp, sign }, { isJson: true })

// 统一支付
export const fetchTongyizhifu = ({ timestamp, sign }: any) => api.post(url.tongyizhifu, { timestamp, sign }, { isJson: true })

// 支付回写
export const fetchPaidBackWrite = ({ timestamp, sign }: any) => api.post(url.paidBackWrite, { timestamp, sign }, { isJson: true })

// 支付上报
export const fetchReportPayment = ({ timestamp, sign }: any) => api.post(url.reportPayment, { timestamp, sign }, { isJson: true })

// 取消支付
export const fetchCancelNormalPay = ({ timestamp, sign }: any) => api.post(url.cancelNormalPay, { timestamp, sign }, { isJson: true })
