import { handleActions } from 'redux-actions'
import { fromJS, setIn } from 'immutable'
import * as types from './order-detail.type'

const initState = fromJS({
	sourceInfo: {}, // 原单信息
	subOrderInfo: {
		errno: '',
		errmsg: '',
		data: {
			orderId: 0,
			price: 0
		}
	}, // 创建补单接口返回data
	modifyOrderInfo: {
		errno: '',
		errmsg: '',
		data: {
			orderId: 0,
			price: 0
		}
	},
	repairInfo: {
		content: {
			result: {
				vecMutiTradeDdo: [],
				repairList: [],
				dealState: 0,
				dealDiscountPayment: 0,
				dealCouponPayment: 0,
				totalPayPrice: 0,
				totalPickMoney: 0,
				totalPickAgio: 0
			}
		}
	}, // 补单信息
	writeOffMsg: {
		errno: -1,
		errmsg: ''
	}
})

interface IAnyObj {
	[key: string]: any
}

// reduce
export const orderDetail = handleActions(
	{
		[types.WRITE_OFF_UPDATE]: (state, action) => state.set('writeOffMsg', action.payload),
		[types.SUB_ORDER_INFO_UPDATE]: (state, action) => state.set('subOrderInfo', action.payload),
		[types.MODIFY_ORDER_INFO_UPDATE]: (state, action) =>
			state.set('modifyOrderInfo', action.payload),
		// [types.ORDER_SOURCE_SET]: (state, action) => state.set('sourceInfo', action.payload),
		[types.ORDER_REPAIR_UPDATE]: (state, action) => state.set('repairInfo', action.payload)
		// [types.SAGA_WRITE_OFF_UPDATE]: (state, action) => state.set('status', action.payload.errno),
	},
	initState
)
