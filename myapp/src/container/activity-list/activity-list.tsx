import React from 'react'
import { RouteComponentProps } from "react-router";
import moment from 'moment'
import { Card, WingBlank, WhiteSpace, ActivityIndicator } from 'antd-mobile';
import { getActivityListSaga } from '../../redux/activity/activity.action'

import './activity-list.styl'
import { connect } from "react-redux-immutable";
import { fixAndroidText } from "../../shared/script/utils";

interface IProps extends RouteComponentProps {
	getActivityListSaga: () => void,
	list: any[],
	pageLoading: boolean,
	listIsEmpty: boolean,
}

interface IState {
}

const ListItem = (props: any) => {
	return (
		<div className="list__item" key={props.id} onClick={props.onClick}>
			<WingBlank size="md">
				<WhiteSpace size="md"/>
				<Card>
					<Card.Header
						title={<span className='item__title' style={{...fixAndroidText}}>互动订单编号: {props.payOrderCode}</span>}
						extra=
							{
								props.state !== 0
									? <span className='item__extra'>已处理</span>
									: <span className='item__extra active'>未处理</span>
							}
					/>
					<Card.Body>
						<h3 className='item__title'>{props.activityName}</h3>
						<div className="run-time time">
            <span>
	            举办时间
            </span>
							<time>
								{moment(props.activityBeginTime).format('YYYY-MM-DD hh:mm:ss ')}
							</time>
						</div>
						<div className="create-time time">
            <span>
	            创建时间
            </span>
							<time>
								{moment(props.createTime).format('YYYY-MM-DD hh:mm:ss ')}
							</time>
						</div>
					</Card.Body>
				</Card>
			</WingBlank>
		</div>
	)
}

@(connect(
	(state: any) => ({
		list: state.getIn(['activity', 'list']),
		pageLoading: state.getIn(['activity', 'pageLoading']),
		listIsEmpty: state.getIn(['activity', 'listIsEmpty']),
	}),
	{ getActivityListSaga }
) as any)
class ActivityList extends React.PureComponent<IProps, IState> {

	componentDidMount() {
		document.title = '互动活动反馈单列表'
		window.kwapp && window.kwapp.setTitle('互动活动反馈单列表')
		const { list, getActivityListSaga } = this.props
		if (list.length === 0) getActivityListSaga()
	}

	componentWillUnmount() {}

	render() {
		const { list, getActivityListSaga, pageLoading, listIsEmpty } = this.props

		return (
			<div className="activity-list">
				<section className="activity-list__container">
					<div className="list">
						{ list.map((item: any) => <ListItem key={item.id} {...item} onClick={() => this.props.history.push(`/streams-rkhy/activity-detail/${item.id}`)} />) }
						{
							pageLoading
								? <div className='loading'>
									{ !!list.length && <ActivityIndicator text={'正在加载'}/> }
								</div>
								: !listIsEmpty
										? <div className='loading' onClick={getActivityListSaga}>点击加载更多</div>
										: <div className="loading">无更多内容</div>
						}
					</div>
					<WhiteSpace size="md"/>
				</section>
			</div>
		)
	}
}

export default ActivityList
