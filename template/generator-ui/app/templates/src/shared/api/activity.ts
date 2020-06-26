import axios from 'axios'
import api from './service'
import { getHost } from '../config/constant'

export interface IFetchActivityListParams {
	page: number,
	limit?: number,
}

export const fetchActivityList = ({ page = 1, limit = 10 }: IFetchActivityListParams) => api.post(`${getHost('vigour')}/vigour-web/api/feedback/queryFeedbackOrderList.do`, { page, limit }, { withCredentials: true }, true)

export interface IFetchActivityDetailParams {
	id: number | string,
}

export const fetchActivityDetail = ({ id }: IFetchActivityDetailParams) => api.post(`${getHost('vigour')}/vigour-web/api/feedback/queryFeedbackOrderDetail.do`, { id }, { withCredentials: true }, true)

export interface IFetchSumitFeedBackParams {
	payOrderFeedbackId: number | string,
	rightsFileList: any[],
}

export const fetchSumitFeedBack = (params: IFetchSumitFeedBackParams) => api.post(`${getHost('vigour')}/vigour-web/api/feedback/submitFeedbackAttachments.do`, params, { withCredentials: true }, true)

// export const fetchUploadImage = (formData: FormData) => axios.post('https://ims.haiziwang.com/pic/file/upload.do?bucket=wxmallpic', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
export const fetchUploadImage = (formData: FormData) => axios.post(`${getHost('vigour')}/vigour-web/api/feedback/uploadFileToKFS.do`, formData, {
	withCredentials: true,
	headers: { 'Content-Type': 'multipart/form-data' }
})
