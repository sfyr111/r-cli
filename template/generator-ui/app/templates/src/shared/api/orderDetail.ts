import api from './service'
import qs from 'qs'
import Api from '../../shared/api/apiUrl'
// import { getHost } from '../config/constant'

export interface IFetchOmsOperate {
	billNumber: string // 单据号
}

export interface IFetchSaleBillParams {
	mtenantId: string // 租户号
	deptCode: string // 部门编码
	billNumber: string // 单据号
}

export interface IFetchWriteOffParams {
	Param: {
		DealCode: string
		WriteOffID: string
		WriteOffTime: number
		ItemList?: []
	}
	_platform_num: string
}

export const fetchSaleBill = (params: IFetchSaleBillParams) =>
	api.get(Api.getFatherSaleBill, params, { withCredentials: true })

export const fetchCreateSubOrder = (params: any) =>
	api.get(Api.createSubOrder, params, { withCredentials: true })

export const fetchModifyPickOrder = (params: any) =>
	api.get(Api.modifyPickOrder, params, { withCredentials: true })

export const fetchWriteOff = (params: IFetchWriteOffParams) =>
	api.get(
		Api.updateWriteOff,
		{ ...params },
		{
			withCredentials: true
		}
	)
