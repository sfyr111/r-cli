import React from 'react'
import { Card } from 'antd-mobile'
import { connect } from 'react-redux-immutable'
import { formatCents } from '../../shared/script/utils'
import './realPayforMoney.styl'

interface IState {}

interface IAnyObj {
	[key: string]: any
}

interface IProps {
	[key: string]: any
}

@(connect((state: any) => ({
	// sourceInfo: state.getIn(['orderDetail', 'sourceInfo', 'content', 'result']),
	repairInfo: state.getIn(['orderDetail', 'repairInfo', 'content', 'result'])
})) as any)
class RealPayforMoney extends React.PureComponent<IProps, IState> {
	render() {
		return (
			<Card>
				<Card.Body>
					<div className="realPayforMoney">
						<span className="title">实际支付</span>
						<span className="money zheng2">
							{formatCents(this.props.repairInfo.totalDiff || 0)}
						</span>
					</div>
				</Card.Body>
			</Card>
		)
	}
}

export default RealPayforMoney
