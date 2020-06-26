import * as React from 'react';
import { memo } from 'react';
import { FunctionComponent, ReactElement } from 'react';
import './result.styl';

interface activeItem {
  text: string;
  type: string;
  handle: () => void;
}

interface IProps {
  status: 'success' | 'error';
  successMsg?: string;
  errorMsg?: string;
  ext?: ReactElement | string;
  successActive?: ReactElement;
  errorActive?: ReactElement;
  activeData?: activeItem[];
}

const Result: FunctionComponent<IProps> = memo((props) => {
  const { status, successMsg, errorMsg, ext, activeData } = props;

  return (
    <div className="result">
      <div className="result__container">
        <figure>
          {status === 'success' ? (
            <>
              <img src={require('../../images/成功.png')} alt="成功" />
              <figcaption>{successMsg}</figcaption>
            </>
          ) : (
            <>
              <img src={require('../../images/失败.png')} alt="失败" />
              <figcaption>{errorMsg}</figcaption>
            </>
          )}
        </figure>
        {!!ext && <p className="ext">{ext}</p>}
        <section className="result__active">
          {!!activeData &&
            activeData.length > 0 &&
            activeData.map((item: activeItem) => (
              <a key={item.text} className={`btn result__btn--${item.type}`} onClick={item.handle}>
                {item.text}
              </a>
            ))}
        </section>
      </div>
    </div>
  );
});

Result.defaultProps = {
  status: 'success'
};

export default Result;
