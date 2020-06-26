import * as React from 'react';
import { memo } from 'react';
import { FunctionComponent, ReactElement } from 'react';
import './cash-result.styl';

interface IProps {

}

const CashResult: FunctionComponent<IProps> = memo((props) => {
  const { } = props;

  return (
    <div className="cash-result">
      <div className="cash-result__container">

      </div>
    </div>
  );
});

CashResult.defaultProps = {

};

export default CashResult;
