import React from 'react'
import { Card, WingBlank, WhiteSpace, ImagePicker, Button, Toast } from 'antd-mobile';
import { RouteComponentProps } from "react-router";
import * as R from 'ramda'
import {
	getActivityDetailSaga, removeActivityCrowdFileSaga,
	removeActivityRightsFileSaga,
	uploadActivityCrowdFilesSaga,
	uploadActivityRightsFilesSaga,
	sumitFeedBackSaga
} from '../../redux/activity/activity.action'

import './activity-detail.styl'
import { connect } from "react-redux-immutable";
import { IFetchActivityDetailParams } from "../../shared/api/activity";
import moment from "moment";
import { fixAndroidText, isAndroid, isIPhoneX, isIPhoneXR, isIPhoneXSMax } from "../../shared/script/utils";

interface IProps extends RouteComponentProps {
	getActivityDetailSaga: (params: IFetchActivityDetailParams) => void,
	uploadActivityCrowdFilesSaga: (params: any[]) => void,
	uploadActivityRightsFilesSaga: (params: any[]) => void,
	removeActivityCrowdFileSaga: (params: number) => void,
	removeActivityRightsFileSaga: (params: number) => void,
	sumitFeedBackSaga: (id: number | string) => void,
	detail: any,
	rightsFileList: any[],
}

interface IState {
}

enum UploadKeys {
	RIGHTSFILELIST,
}

const maxFile = 10

@(connect(
	(state: any) => ({
		detail: state.getIn(['activity', 'detail']),
		rightsFileList: state.getIn(['activity', 'rightsFileList']),
	}),
	{ getActivityDetailSaga, uploadActivityCrowdFilesSaga, uploadActivityRightsFilesSaga, removeActivityCrowdFileSaga, removeActivityRightsFileSaga, sumitFeedBackSaga }
) as any)
class ActivityDetail extends React.PureComponent<IProps, IState> {

	state = {
	}

  componentDidMount() {
	  document.title = '互动活动反馈单'
	  window.kwapp && window.kwapp.setTitle('互动活动反馈单')
	  const { getActivityDetailSaga, match: { params } } = this.props
	  getActivityDetailSaga((params as IFetchActivityDetailParams))

	  // var rs = document.querySelectorAll('.am-image-picker-item-remove')
	  // rs.forEach((s: Element) => s && (s as Element).parentElement.removeChild(s))

  }

	sumit = () => {
		const { match: { params }, sumitFeedBackSaga } = this.props
		sumitFeedBackSaga((params as any).id)
	}

	onImageChange = (files: any, type: string, index: number | undefined, key: UploadKeys) => {
		if (type === 'add')
			this.addImageChange(files, key)
		else if (type === 'remove')
			this.removeImageChange(files, (index as number), key)
	}

	addImageChange = (files: any[], key: UploadKeys) => {
		const { uploadActivityRightsFilesSaga } = this.props

		const hasLimitSize = files.some((item: any) => item.file ? item.file.size / 1024 / 1024 > 5 : false)

		if (hasLimitSize) return Toast.info(`文件大小不可超过5MB`, .8)

		if (files.length > maxFile) return Toast.info(`最多只能上传${maxFile}张图片, 请重新选择。`, .8)

		if (key === UploadKeys.RIGHTSFILELIST)
			uploadActivityRightsFilesSaga(files.map((f: any) => f.file))
	}

	removeImageChange = (files: any, index: number, key: UploadKeys) => {
		const { removeActivityRightsFileSaga } = this.props

		if (key === UploadKeys.RIGHTSFILELIST)
			removeActivityRightsFileSaga(index)
	}

  render() {
  	const { detail, rightsFileList } = this.props

    return (
      <div className="activity-detail">
        <section className="activity-detail__container">
	        <div className="bg"></div>

          <div className="activity-info">
	          <WingBlank size="md">
		          <Card>
			          <Card.Header
				          title={<span className='title'>活动信息</span>}
			          />
			          <Card.Body>
				          <div className="cell">
                    <span className="left">子订单编号: </span>
                    <span className="right">{detail.payOrderCode}</span>
				          </div>
				          <div className="cell">
                    <span className="left">活动名称: </span>
                    <span className="right">{detail.activityName}</span>
				          </div>
				          <div className="cell">
                    <span className="left">门店名称: </span>
                    <span className="right">{detail.activityAddr}</span>
				          </div>
				          <div className="cell">
                    <span className="left">活动场地: </span>
                    <span className="right">{detail.activityAddr}</span>
				          </div>
				          <div className="cell">
                    <span className="left">活动开始时间: </span>
                    <span className="right">{ moment(detail.activityBeginTime).format('YYYY-MM-DD hh:mm:ss ') } </span>
				          </div>
				          <div className="cell">
                    <span className="left">活动结束时间: </span>
                    <span className="right">{ moment(detail.activityEndTime).format('YYYY-MM-DD hh:mm:ss ') } </span>
				          </div>
			          </Card.Body>
		          </Card>
	          </WingBlank>
          </div>

	        <WhiteSpace size="md" />

          <div className="equity-photo">
	          <WingBlank size="md">
		          <Card>
			          <Card.Header
				          title={<span className='title'>权益照片</span>}
			          />
			          <Card.Body>
				          <div className="explanation" style={{}}>
					          <span>上传照片</span>
					          <span style={{}}>(最多10张)</span>
				          </div>
				          <div className="explanation-extra">
					          <span>{detail.uploadActivityImageDescribe}</span>
				          </div>
				          <div className="upload__content">
					          <ImagePicker
						          files={
						          	rightsFileList.map(
						          		(item: any) => R.assoc('url', item.fileUrl)(item)
						            )
						          }
						          multiple={true}
						          selectable={rightsFileList.length < maxFile}
						          onChange={(files: {}[], type: string, index: number | undefined): void => { this.onImageChange(files, type, index, UploadKeys.RIGHTSFILELIST) }}/>
				          </div>
			          </Card.Body>
		          </Card>
	          </WingBlank>
          </div>

	        <WhiteSpace size="lg" />

	        <div className="active">
		        <Button onClick={this.sumit} type="primary" disabled={rightsFileList.length === 0}>提交</Button>
	        </div>
        </section>

	      { (isIPhoneX || isIPhoneXR || isIPhoneXSMax) && <section className="iphonexxx"></section> }
      </div>
    )
  }
}

export default ActivityDetail
