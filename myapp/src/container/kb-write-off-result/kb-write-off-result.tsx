import React, { FunctionComponent, memo, useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router';
import qs from 'qs';

import './kb-write-off-result.styl';

import Result from '../../component/result/result';
import {
  genQueryStringForObj,
  getQueryObjForSearch,
  goHome,
  publicPath
} from '../../shared/script/utils';
import { useHistory, useLocation } from 'react-router-dom';

interface IProps extends RouteComponentProps {}

const KbWriteOffResult: FunctionComponent<IProps> = memo((props: IProps) => {
  const {} = props;
  const { search } = useLocation();
  const history = useHistory();
  const [pageStatus, setPageState] = useState(0);
  const { status = '0', ticketCode } = getQueryObjForSearch(search);

  useEffect(() => {
    const title = status === '1' ? '核销成功' : '核销失败';
    document.title = title;
    window.kwapp && window.kwapp.setTitle(title);

    setPageState(Number(status));
  }, [status]);

  const successActiveData = [
    { text: '返回首页', type: 'default', handle: () => goHome() },
    {
      text: '继续核销',
      type: 'primary',
      handle: () => history.replace(`${publicPath()}/kb-store-select?needWriteOff=1`)
    }
  ];

  const errorActiveData = [
    { text: '返回首页', type: 'default', handle: () => goHome() },
    {
      text: '重新核销',
      type: 'primary',
      handle: () => history.replace(`${publicPath()}/kb-store-select?needWriteOff=1`)
    }
  ];

  return (
    <div className="cash-result">
      <div className="cash-result__container">
        {!!pageStatus ? (
          <Result
            status="success"
            successMsg="核销成功"
            activeData={successActiveData}
            ext={ticketCode && <span>订单号：{ticketCode}</span>}
          />
        ) : (
          <Result
            status="error"
            errorMsg="核销失败"
            activeData={errorActiveData}
            ext={<span>核销异常，请稍后重试</span>}
          />
        )}
      </div>
    </div>
  );
});

KbWriteOffResult.defaultProps = {};

export default KbWriteOffResult;
