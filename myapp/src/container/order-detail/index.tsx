import React from 'react';
import { RouteComponentProps } from 'react-router';
import { Card, WhiteSpace, Button, Toast, Modal } from 'antd-mobile';
import jsCookie from 'js-cookie';
import qs from 'qs';
import { connect } from 'react-redux-immutable';
import { getOrderDetailSaga, toPaySaga, toWriteOffSaga } from './store/order-detail.action';
import SourceInfo from './sourceInfo';
import RepairInfo from './repairInfo';
import './index.styl';
import { getQueryObjForSearch, publicPath } from '../../shared/script/utils';

interface IState {}

interface IProps extends RouteComponentProps {
  repairInfo: any;
  writeOffMsg: any;
  subOrderInfo: any;
  getOrderDetailSaga: (params: any) => void;
  toPaySaga: (params: any) => void;
  toWriteOffSaga: (params: any) => void;
}

const alert = Modal.alert;

const Point = function (title: string) {
  return (
    <div className="zitidian">
      <img src={require('../../images/zitidian@2x.png')} />
      <span>{title}</span>
    </div>
  );
};

@(connect(
  (state: any) => ({
    repairInfo: state.getIn(['orderDetail', 'repairInfo', 'content', 'result']),
    writeOffMsg: state.get('writeOffMsg'),
    subOrderInfo: state.get('subOrderInfo')
  }),
  { getOrderDetailSaga, toPaySaga, toWriteOffSaga }
) as any)
class OrderDetail extends React.PureComponent<IProps, IState> {
  state = {};

  constructor(props: IProps) {
    super(props);
  }

  toPayfor = () => {
    const {
      location: { search },
      repairInfo: { outStatus }
    } = this.props;
    const { billNumber } = getQueryObjForSearch(search);

    if (outStatus === 2) {
      this.props.toPaySaga({ billNumber });
    } else {
      if (outStatus === 0) {
        this.promptBox('本单商品未签收，请签收完再支付！', () =>
          this.props.toPaySaga({ billNumber })
        );
      } else {
        this.promptBox('本单有未签收商品，继续支付将直接退款，是否继续支付？', () =>
          this.props.toPaySaga({ billNumber })
        );
      }
    }
  };

  promptBox = (content: string, callback: Function) => {
    alert('温馨提示', content, [
      { text: '关闭', onPress: () => {}, style: 'default' },
      { text: '确定', onPress: () => callback() }
    ]);
  };

  toWriteOff = async () => {
    const { outStatus } = this.props.repairInfo;

    const {
      location: { search }
    } = this.props;
    const { billNumber, from } = getQueryObjForSearch(search);

    const writeOff = () => {
      const deptCode = jsCookie.get('deptCode');
      if (deptCode === '000') return Toast.fail('员工无操作权限', 1);
      this.props.toWriteOffSaga({ billNumber, from, callback: this.loadData });
    };

    if (outStatus === 2 || from === 'payResult') {
      writeOff();
    } else {
      if (outStatus === 0) {
        this.promptBox('本单商品未签收，请签收完再核销！', writeOff);
      } else {
        this.promptBox('本单有未签收商品，继续核销将直接退款，是否继续核销？', writeOff);
      }
    }
  };

  // 1支付  其他不显示
  isShowPf = () => {
    const {
      location: { search }
    } = this.props;
    const { from } = getQueryObjForSearch(search);
    const { repairInfo } = this.props;
    if (from === 'payResult') return false;
    else {
      if (repairInfo.dealState === 1) return true;
      else if (
        repairInfo.dealState === 9 &&
        repairInfo.repairList.length > 0 &&
        repairInfo.totalDiff > 0
      )
        return true;
    }
    return false;
  };

  isShowFooter() {
    return (
      this.props.repairInfo.dealState === 1 ||
      this.props.repairInfo.dealState === 9 ||
      (this.props.repairInfo.dealState === 6 && this.props.repairInfo.repairList.length > 0)
    );
  }

  // 1核销  其他不显示
  isShowWf() {
    const {
      location: { search }
    } = this.props;
    const { from } = getQueryObjForSearch(search);
    const { dealState, repairList, totalDiff } = this.props.repairInfo;
    if (from === 'payResult') return true;
    else if (dealState === 9 && (repairList.length === 0 || totalDiff <= 0)) return true;
    return false;
  }

  isPfthenWf() {
    const { repairList, dealState } = this.props.repairInfo;
    if (dealState === 6 && repairList.length > 0) return 1;
    else return 0;
  }

  loadData = () => {
    const { billNumber } = getQueryObjForSearch(this.props.history.location.search);

    const action = this.props.getOrderDetailSaga({
      mtenantId: jsCookie.get('_platform_num') || '101397',
      deptCode: jsCookie.get('deptCode') || '12032',
      billNumber: billNumber || '1215573504356'
    });
    /* 18888888881/12345678      门店编码62020 */
  };

  componentDidMount() {
    document.title = '订单详情';
    window.kwapp && window.kwapp.setTitle('订单详情');
    this.loadData();
  }

  render() {
    const { /* sourceInfo,  */ repairInfo } = this.props;
    return (
      <div className="order-detail">
        <div className="content">
          <Card>
            <Card.Header title={Point(repairInfo ? repairInfo.storeName : '')} />
          </Card>
          <WhiteSpace />
          <SourceInfo />
          {repairInfo.dealState === 9 && repairInfo.repairList.length > 0 && <RepairInfo />}
          <WhiteSpace />
          {/* {this.isShowPf() && <RealPayforMoney />} */}
        </div>
        <div className={`tishi ${this.isPfthenWf() ? 'show' : ''}`}>
          <img src={require('../../images/gantan@2x.png')} />
          <span>先支付再核销</span>
        </div>
        <div className={`footer ${this.isShowFooter() ? 'show' : 'hide'}`}>
          <Button
            type="primary"
            className={`payfor ${this.isShowPf() ? 'show' : ''}`}
            onClick={this.toPayfor}
          >
            去支付
          </Button>
          <Button
            type="primary"
            className={`writeOff ${this.isShowWf() ? 'show' : 'hide'}`}
            onClick={this.toWriteOff}
          >
            去核销
          </Button>
        </div>
      </div>
    );
  }
}

export default OrderDetail;
