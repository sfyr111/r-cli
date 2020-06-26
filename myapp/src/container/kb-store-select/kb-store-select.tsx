import React, { FunctionComponent, memo, useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router';
import { useParams, useLocation, useHistory, useRouteMatch } from 'react-router-dom';
import { Toast } from 'antd-mobile';
import { useSelector, useDispatch } from 'react-redux';
import { fromJS } from 'immutable';
import classnames from 'classnames';
import './kb-store-select.styl';
import {
  getKbStoreListSaga,
  updateKbStoreSelected,
  writeOffKbStoreSaga
} from './store/kb-store.action';
import { getQueryObjForSearch, publicPath, scan, sleep } from '../../shared/script/utils';
import { fetchWriteOffGoods } from './store/api';
import jsCookie from 'js-cookie';

interface IProps extends RouteComponentProps {}

const KbStoreSelect: FunctionComponent<IProps> = memo((props: IProps) => {
  const {} = props;
  const kbStoreList = useSelector((state: any) => state.getIn(['kbStore', 'storeList'])).toJS();
  const selectedStore = useSelector((state: any) =>
    state.getIn(['kbStore', 'selectedStore'])
  ).toJS();
  const dispatch = useDispatch();
  const history = useHistory();
  const { search } = useLocation();

  useEffect(() => {
    (async () => {
      const title = '请选择门店';
      document.title = title;
      window.kwapp && window.kwapp.setTitle(title);
      dispatch(getKbStoreListSaga());
      const { needWriteOff } = getQueryObjForSearch(search);
      if (needWriteOff === '1' && !!selectedStore.deptCode) {
        await sleep(300);
        writeOff && writeOff.call(null);
      } // 自动扫码核销
    })();
  }, []);

  const setStore = (store: any) => () => dispatch(updateKbStoreSelected(fromJS(store)));

  const writeOff = async () => {
    const { deptCode } = selectedStore;
    if (!deptCode) return;

    const ticketCode = await scan();

    dispatch(writeOffKbStoreSaga(ticketCode));
  };

  const listCellClassName = (item: any) => {
    const isActive = item.deptCode === selectedStore.deptCode;
    return classnames('list__cell', { active: isActive });
  };

  return (
    <div className="store-select">
      <div className="store-select__container">
        <div className="list">
          {kbStoreList.map((item: any) => (
            <div className={listCellClassName(item)} key={item.deptCode} onClick={setStore(item)}>
              <span>{item.deptCode}</span>
              <p>{item.deptName}</p>
              <i></i>
            </div>
          ))}
        </div>

        <div className="action" onClick={writeOff}>
          <a className="btn">确认</a>
        </div>
      </div>
    </div>
  );
});

KbStoreSelect.defaultProps = {};

export default KbStoreSelect;
