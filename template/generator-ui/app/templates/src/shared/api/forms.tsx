import api from './service'
import { getHost } from '../config/constant'

export const fetchCheckProgress = () => api.get(`${getHost('bpc')}/api/v2/apply/check`, {}, { withCredentials: true })

// 提交表单
export const fetchFormsApply = (params: any) => api.post(`${getHost('bpc')}/api/v2/apply`, params, { withCredentials: true }, true)

// 获取表单数据
export const fetchFormsData = (type?: any) => api.get(`${getHost('bpc')}/api/v2/apply`, { type }, { withCredentials: true })

export const fetchFormsProcess = () => api.get(`${getHost('bpc')}/api/v2/apply/record`, {} , { withCredentials: true })