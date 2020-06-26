import React from 'react'
import { } from 'antd-mobile'
import { RouteComponentProps } from 'react-router'
import { connect } from 'react-redux-immutable'
import { initCashPageSaga } from './store/cash.action'
import './cash-page.styl'

interface IProps extends RouteComponentProps<any> {
  initCashPageSaga: () => void
}

interface IState {

}

@(connect(
  (state: any) => ({
    data: state.getIn(['cashPage', 'data']),
  }),
  { initCashPageSaga }
) as any)
class CashPage extends React.PureComponent<IProps, IState> {
  state = {
  }

  componentDidMount() {
    document.title = 'cash-page'
    window.kwapp && window.kwapp.setTitle('cash-page')
    const {
      location: { search },
      match: { params },
    } = this.props
    this.props.initCashPageSaga()
  }

  render() {
    const { data } = this.props
    const {  } = this.state

    return (
      <div className="cash-page">
        <div className="cash-page__container">
           {data.name}
        </div>
      </div>
    )
  }
}

export default CashPage
