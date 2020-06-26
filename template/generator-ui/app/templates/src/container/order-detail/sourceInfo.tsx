import React from 'react'
import { Card } from 'antd-mobile'
import { connect } from 'react-redux-immutable'
import { formatCents } from '../../shared/script/utils'
// import PackageList from './packageList'
import GoodsList from './goodsList'

interface IState {}

interface IAnyObj {
	[key: string]: any
}

interface IProps {
	[key: string]: any
}

// OMS_DEAL_STATE_START     = 0, //交易流程开始
//  OMS_DEAL_STATE_WAIT_PAY     = 1, //待支付, 等待（买家）付款
//  OMS_DEAL_STATE_WAIT_MARKSHIP   = 2, //待出库, 等待（卖家）发货
//  OMS_DEAL_STATE_WAIT_CONFIRM_RECV   = 3, //已出库（等待签收）
//  OMS_DEAL_STATE_PACKED  = 4, //已打包（等待自提）
//  OMS_DEAL_STATE_WAIT_EVALUATE   = 5, //已签收待评论（等待评论）
//  OMS_DEAL_STATE_SUCCESS   = 6, //交易成功（最后有成交商品，完成打款到卖家）
//  OMS_DEAL_STATE_CANCEL    = 7, //交易取消
//  OMS_DEAL_STATE_CLOSED    = 8, //交易关闭
//  OMS_DEAL_STATE_WAIT_WRITE_OFF  = 9, //待核销

const img = function (data: IAnyObj) {
	const { dealState } = data
	if (dealState === 1) return require('../../images/daizhifu@2x.png')
	// 待支付
	else if (dealState === 5) return require('../../images/yihexiao@2x.png')
	else if (dealState === 6) {
		// 交易成功---已支付
		if (data.repairList.length > 0) {
			return require('../../images/daihexiao@2x.png')
		} else {
			return require('../../images/yizhifu@2x.png')
		}
	} else if (dealState === 9) return require('../../images/daihexiao@2x.png')
	else return ''
}

const Title = function (data: IAnyObj) {
	return (
		<div style={{ width: '100%' }}>
			<div className="title">
				<span>原单信息</span>
				<img className="yihexiao_img" src={img(data)} />
			</div>
			<div className="bianhao">
				<span>订单编号：</span>
				<span>{data.dealCode}</span>
				<span className="count">
					共<span>{data.vecMutiTradeDdo.length}</span>件
				</span>
			</div>
		</div>
	)
}

const Footer = function (data: IAnyObj) {
	return (
		<div className="totalInfo">
			<div>
				<span className="title">商品总额：</span>
				<span className="money zheng2">
					{formatCents(
						data.dealState === 9
							? Math.abs(data.dealTotalFee)
							: Math.abs(data.totalPickMoney)
					)}
				</span>
			</div>
			<div>
				<span className="title">优惠总额{data.dealState !== 9 && '(不包含优惠券)'}：</span>
				<span className={'money discount fu'}>
					{formatCents(
						data.dealState === 9
							? Math.abs(data.dealDiscountPayment + data.dealCouponPayment)
							: Math.abs(data.dealDiscountPayment)
					)}
				</span>
			</div>

			<div className={`${data.dealState === 9 ? 'hide' : ''}`}>
				<span className="title">手工折扣：</span>
				<span className={`money discount ${data.totalPickAgio >= 0 ? 'fu' : 'zheng2'}`}>
					{formatCents(Math.abs(data.totalPickAgio))}
				</span>
			</div>
			<div>
				<span className="title">原单付款：</span>
				<span className={`money actual ${data.totalPayPrice < 0 ? 'fu' : 'zheng2'} `}>
					{formatCents(
						Math.abs(
							data.dealState === 9
								? Math.abs(data.dealTotalPayment)
								: data.totalPayPrice
						)
					)}
				</span>
			</div>
		</div>
	)
}

@(connect((state: any) => ({
	// sourceInfo: state.getIn(['orderDetail', 'sourceInfo', 'content', 'result']),
	repairInfo: state.getIn(['orderDetail', 'repairInfo', 'content', 'result'])
})) as any)
class SourceInfo extends React.PureComponent<IProps, IState> {
	/* static getDerivedStateFromProps(nextProps: any, prevState: any) {
    console.log(nextProps, prevState)
    return null
  } */
	state = {}
	render() {
		// const data = this.props.sourceInfo || { vecMutiTradeDdo: [], dealState: 0 }
		const data = this.props.repairInfo || { repairList: [], vecMutiTradeDdo: [] }
		return (
			<Card className="sourceInfo">
				<Card.Header title={Title(data)} />
				<Card.Body>
					{/* <GoodsList type="source" data={data.vecMutiTradeDdo} data2={data.repairList} /> */}
					<GoodsList type="source" data={data} />
				</Card.Body>
				<Card.Footer content={Footer(data)} />
			</Card>
		)
	}
}

export default SourceInfo
