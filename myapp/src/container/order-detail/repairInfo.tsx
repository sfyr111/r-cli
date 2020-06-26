import React from 'react';
import { Card } from 'antd-mobile';
import { connect } from 'react-redux-immutable';
import qs from 'qs';
// import PackageList from './packageList'
import { formatCents } from '../../shared/script/utils';
import GoodsList from './goodsList';
import './repairInfo.styl';

interface IState {}

interface IAnyObj {
  [key: string]: any;
}

interface IProps {
  [key: string]: any;
}

const { billNumber, from } = qs.parse(location.search, {
  ignoreQueryPrefix: true
});

const img = function (dealState: number) {
  /* if (dealState === 1) return require('../../images/daizhifu@2x.png')
	else if (dealState === 5) return require('../../images/yihexiao@2x.png')
	else if (dealState === 6) return require('../../images/yizhifu@2x.png')
	else if (dealState === 9) return require('../../images/daihexiao@2x.png')
  else return '' */
  return require('../../images/daizhifu@2x.png');
};

const Title = function (dealState: number) {
  return (
    <div style={{ width: '100%' }}>
      <div className="title">
        <span>退补信息</span>
        {from === 'payResult' && <img className="daizhifu_img" src={img(dealState)} />}
      </div>
      <div className="bianhao">
        <span>(退补单价商品实付单价为准)</span>
      </div>
    </div>
  );
};

const Footer = function (data: IAnyObj) {
  const totalPickAgio = data.totalPickAgio;
  const totalDiff = data.totalDiff;
  return (
    <div className="totalInfo">
      <div>
        <span className="title">补差总额：</span>
        <span className={`money jine ${totalDiff < 0 ? 'fu' : ''} `}>
          {formatCents(Math.abs(totalDiff))}
        </span>
      </div>
      {/* <div>
				<span className="title">手工折扣：</span>
				<span className={'money jine fu discount '}>
					{formatCents(Math.abs(totalPickAgio))}
				</span>
			</div> */}
      <div>
        <span className="title">实际付款：</span>
        <span className={`money jine actual ${totalDiff < 0 ? 'fu' : ''} `}>
          {formatCents(Math.abs(totalDiff))}
        </span>
      </div>
    </div>
  );
};

@(connect((state: any) => ({
  // sourceInfo: state.getIn(['orderDetail', 'sourceInfo', 'content', 'result']),
  repairInfo: state.getIn(['orderDetail', 'repairInfo', 'content', 'result'])
})) as any)
class RepairInfo extends React.PureComponent<IProps, IState> {
  /* static getDerivedStateFromProps(nextProps: any, prevState: any) {
    console.log(nextProps, prevState)
    return null
  } */

  state = {};

  render() {
    const data = this.props.repairInfo || { repairList: [], vecMutiTradeDdo: [], dealState: 0 };
    // const data = this.props.sourceInfo || { vecMutiTradeDdo: [], dealState: 0 }
    return (
      <Card className="repairInfo">
        <Card.Header title={Title(data.dealState)} />
        <Card.Body>
          <GoodsList type="repair" data={data} />
        </Card.Body>
        <Card.Footer content={Footer(data)} />
      </Card>
    );
  }
}

export default RepairInfo;
