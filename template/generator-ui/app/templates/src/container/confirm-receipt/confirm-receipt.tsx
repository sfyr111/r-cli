import React, { ChangeEvent } from 'react';
import { RouteComponentProps } from 'react-router';
import { Toast, Picker } from 'antd-mobile';
import jsCookie from 'js-cookie';

import './confirm-receipt.styl';
import {
  fetchPackageDetail,
  signPackageInfo,
  getPackageDeliverList,
  savePackageShelves
} from '../../shared/api/package';

interface IProps extends RouteComponentProps {}

interface IState {
  list: Array<Object>;
  shopName: string;
  shopList: Array<Object>;
  inputContent: string;
}

const BoxItem = (props: any) => {
  const { item, index, length, handleScan, viewGoods } = props;

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    item.shelvesCode = e.target.value;
    console.log(item.shelvesCode);
  };

  return (
    <div className="box">
      <div
        className="box__item"
        style={{
          border: item.isView ? 'none' : '',
          paddingBottom: item.isView && index !== length - 1 ? '1px' : ''
        }}
      >
        <span className="box__name">包裹号{item.packageCode}</span>
        <input placeholder="请输入货号" onChange={(e) => handleChange(e)} />
        <img
          className="icon__scan"
          src={require('../../images/scan.png')}
          onClick={() => handleScan(item)}
        />
        <span className="viewGoods" onClick={() => viewGoods(index)}>
          {item.isView ? '收起商品' : '查看商品'}
        </span>
      </div>
      {item.isView ? (
        <div className="goods__list">
          {item.goodsList.map((goods: any, gIndex: number) => {
            return (
              <div className="goods" key={gIndex}>
                <p>{goods.goodsName}</p>
                <p>商品条码：{goods.barCode}</p>
                <p>是否称重：{goods.isWeight === 0 ? '否' : '是'}</p>
              </div>
            );
          })}
        </div>
      ) : (
        ''
      )}
    </div>
  );
};

const SearchComponent = (props: any) => {
  const { scan, inputContent, handleChange, placeholder } = props;

  return (
    <div className="search__card">
      <div className="input__box">
        <img src={require('../../images/icon_search.png')} className="icon__search" />
        <input
          value={inputContent}
          onChange={(e) => handleChange(e)}
          type="text"
          placeholder={placeholder}
        />
      </div>
      <img
        src={require('../../images/scan.png')}
        className="icon__search__scan"
        onClick={() => scan()}
      />
    </div>
  );
};

let shopList: any[] = [];

class ConfirmReceipt extends React.PureComponent<IProps, IState> {
  state = {
    list: [],
    shopName: '',
    shopList: [],
    inputContent: ''
  };

  async componentDidMount() {
    document.title = '自提点确认收货';
    window.kwapp && window.kwapp.setTitle('自提点确认收货');
    const res = await getPackageDeliverList({
      page: 1,
      _platform_num: jsCookie.get('_platform_num'),
      limit: 99999
    });

    if (res.code !== '0') {
      Toast.fail(res.msg);
      return;
    }

    let list = res.content.result.list;

    console.log(window.localStorage);
    let storage = window.localStorage;
    if (storage && storage.shopName) {
      if (list.filter((item: any) => item.pickupName === storage.shopName).length === 0) {
        storage.removeItem('shopName');
      } else {
        this.setState({
          shopName: window.localStorage.shopName
        });
      }
    }

    this.setState({
      shopList: list.map(
        (item: any): Object => {
          item.label = item.pickupName;
          item.value = item.pickupName;
          return item;
        }
      )
    });

    shopList = list;
  }
  // 搜索
  getSearchData = async (content?: string): Promise<void> => {
    console.log(this.state.inputContent);
    if (!this.state.shopName) {
      Toast.fail('请选择门店自提点');
      return;
    }

    if (!content) {
      if (!this.state.inputContent) {
        Toast.fail('请输入正确的箱号！');
        return;
      }
    }
    Toast.loading('查找包裹中');
    const shopId = shopList.filter((item: any) => item.pickupName === this.state.shopName)[0]
      .pickupCode;
    // const shopId = '11238'
    let params = {
      mtenantId: jsCookie.get('_platform_num'),
      boxCode: this.state.inputContent || content,
      shopId,
      shopName: this.state.shopName
    };
    // 签收包裹
    let result = await signPackageInfo(params);
    // console.log(result)
    if (result.code !== '0') {
      Toast.fail(result.msg);
      return;
    }
    // 宏创获取包裹号接口
    let res = await fetchPackageDetail(params);
    Toast.hide();
    if (res.code !== '0') {
      Toast.fail(res.msg);
      return;
    }

    let packageList = res.content.result.packageList;

    if (res.content.result && packageList.length === 0) {
      Toast.fail('无包裹信息！');
      return;
    }

    console.log(packageList);

    this.setState({
      list: packageList.map((item: any) => {
        let newItem: any = {};
        newItem.packageCode = item.packageCode;
        newItem.shelvesCode = '';
        newItem.operatorCode = jsCookie.get('code');
        newItem.billNumber = item.billNumber;
        newItem.isView = false;
        return newItem;
      })
    });
  };
  // 扫码
  scan = (item: any) => {
    console.log(item);
    window.kwapp &&
      window.kwapp.scanQr({
        callback: (result: any) => {
          console.log(result);
          if (!item) {
            this.setState({
              inputContent: result
            });
            this.getSearchData(result);
          }
        }
      });
  };

  viewGoods = (viewIndex: number) => {
    this.setState({
      list: this.state.list.map((item: any, index: number) => {
        if (index === viewIndex) item.isView = !item.isView;
        return item;
      })
    });
  };

  handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    console.log(e.target.value);
    this.setState({
      inputContent: e.target.value
    });
  };
  // 保存包裹上架
  savePackageInfo = async () => {
    // list 发送 保存成功后 提示确认收货成功 然后刷新页面 清空list 保存失败后提示确认收货失败
    console.log(this.state.list);
    const res = await savePackageShelves({
      mtenantId: jsCookie.get('_platform_num'),
      packageList: this.state.list
    });

    if (res.code === '0') {
      Toast.success('确认收货成功！', 2);
      this.setState({
        list: [],
        inputContent: ''
      });
    } else {
      Toast.fail('确认收货失败！');
    }
  };

  onOk = (shopName: string) => {
    this.setState({ shopName });
    window.localStorage.shopName = shopName;
    console.log(window.localStorage);
  };

  render() {
    return (
      <div className="comfirm__receipt">
        <div className="package__header">
          <Picker
            data={this.state.shopList}
            value={[this.state.shopName]}
            cols={1}
            onOk={(value: any[]) => this.onOk(value[0])}
          >
            <div className="deliver">
              <img className="icon_deliver" src={require('../../images/自提点.png')} />
              {!this.state.shopName ? (
                <span className="no__shop">请选择门店自提点</span>
              ) : (
                <span className="shop">{this.state.shopName}</span>
              )}
              <img className="arrow__right" src={require('../../images/arrow_right.png')} />
            </div>
          </Picker>
          {/* 搜索组件 */}
          <SearchComponent
            scan={this.scan}
            handleChange={this.handleChange}
            inputContent={this.state.inputContent}
            getSearchData={this.getSearchData}
            placeholder="请输入箱号"
          />
        </div>
        {this.state.list.length > 0 ? (
          <div className="box__card">
            <p className="title">包裹关联货号</p>
            {this.state.list.map((item: object, index: number) => (
              <BoxItem
                key={index}
                item={item}
                length={this.state.list.length}
                index={index}
                handleScan={this.scan}
                viewGoods={this.viewGoods}
              />
            ))}
          </div>
        ) : (
          ''
        )}
        <div className={`${this.state.list.length > 0 ? 'confirm__box' : 'box__submit'}`}>
          <a
            className={`btn ${this.state.list.length > 0 ? 'confirm__btn' : ''}`}
            onClick={() =>
              this.state.list.length > 0 ? this.savePackageInfo() : this.getSearchData()
            }
          >
            {this.state.list.length > 0 ? '确定' : '搜索'}
          </a>
        </div>
      </div>
    );
  }
}

export default ConfirmReceipt;
