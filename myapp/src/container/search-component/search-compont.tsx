import React, { ChangeEvent } from 'react'

import './search-component.styl'

interface IProps {
  getSearchData: () => void
  placeholder: string
  inputContent: string
  handleChange: (e: ChangeEvent<HTMLInputElement>) => void
  scan: (item: any) => void
}

interface IState {
  inputContent: string
}

class SearchCompont extends React.PureComponent<IProps, IState> {
  constructor(props: IProps) {
    super(props)

    this.state = {
      inputContent: '',
    }
  }

  render() {
    return (
      <div className="search__card">
        <div className="input__box">
          <img src={require('../../images/icon_search.png')} className="icon__search" />
          <input value={this.props.inputContent} onChange={(e) => this.props.handleChange(e)} type="text" placeholder={this.props.placeholder} />
          <img src={require('../../images/scan.png')} className="icon__scan" onClick={this.props.scan} />
        </div>
        <span onClick={() => this.props.getSearchData()}>搜索</span>
      </div>
    )
  }
}

export default SearchCompont
