import api from './service'
import { getHost } from '../config/constant'
import apiUrl from './apiUrl'

export const fetchPackageDetail = (params: any) => api.post(apiUrl.getPackageDetail, params, { withCredentials: true }, true)

export const savePackageShelves = (params: any) => api.post(apiUrl.savePackageShelves, params, { isJson: true, withCredentials: true }, true)

export const getPackageDeliverList = (params: any) => api.post(apiUrl.getPackageDeliverList, params, { isJson: true, withCredentials: true }, true)

export const signPackageInfo = (params: any) => api.post(apiUrl.signPackage, params, { isJson: true, withCredentials: true }, true)

export const fetchSaleBill = (params: any) => api.get(apiUrl.getFatherSaleBill, params, { withCredentials: true })
