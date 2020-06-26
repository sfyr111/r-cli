import React from 'react'
import './goodsList.styl'
import { formatCents, formatWeight } from '../../shared/script/utils'
import { type } from 'os'

interface IState {}

interface IProps {
	data: { vecMutiTradeDdo: any[]; repairList: any[]; dealState: number }
	// data2: any[]
	type: string
}

const Goods = function (props: { data: any; type: string; diff: boolean; dealState: number }) {
	const { data, type, diff, dealState } = props
	return (
		<li className="goodsItem">
			<div className="imgWrap">
				<img src={data.itemLogo} />
			</div>
			<div className="info">
				<div className="title">{data.itemTitle}</div>
				{/* <div className="spec">
					<span>产品规格：</span>
					<span>{data.itemAttr}</span>
				</div> */}
				<div className="footer">
					<div
						className={`delline ${
							dealState === 1 &&
							data.tradeTotalPayment !== data.realPickMoney &&
							type === 'source'
								? 'show'
								: ''
						}`}
					>
						<s className={'delprice zheng2'}>{formatCents(data.tradeTotalPayment)}</s>
						{/* <span className="delnum">{data.tradeNum}</span> */}
					</div>
					<div>
						<span className={`price zheng2 source ${type === 'source' ? 'show' : ''}`}>
							{formatCents(dealState === 1 ? data.pickMoney : data.tradeTotalFee)}
						</span>
						<span className={`price zheng2 repair ${type === 'repair' ? 'show' : ''}`}>
							{formatCents(data.diff || 0)}
						</span>
						<span className={`${data.isWeighing === 1 ? 'weight' : 'num'}`}>
							{getWeightOrnum(type, data, dealState)}
						</span>
					</div>
				</div>
			</div>
		</li>
	)
}

const getWeightOrnum = (type: string, data: any, dealState: number) => {
	if (type === 'repair') {
		if (data.isWeighing === 1) {
			return formatWeight(data.diffWeight, 1000)
		} else {
			return data.diffNum
		}
	} else {
		if (data.isWeighing === 1) {
			// 散称
			if (dealState === 1) {
				// 待支付
				return formatWeight(data.pickWeight, 1000)
			} else {
				return formatWeight(data.weight, 1000)
			}
		} else {
			if (dealState === 1) {
				// 待支付
				return data.pickAmount
			} else {
				return data.tradeNum
			}
		}
	}
}

// 包裹列表
export default function (props: IProps) {
	const {
		data: { vecMutiTradeDdo, repairList, dealState },
		type
	} = props
	const list = type === 'source' ? vecMutiTradeDdo : repairList
	return (
		<ul className="goodsList">
			{list &&
				list.map((v: { [key: string]: any }) => (
					<Goods
						type={props.type}
						data={v}
						dealState={dealState}
						diff={list.length > 0}
						key={v.tradeId}
					/>
				))}
		</ul>
	)
}
