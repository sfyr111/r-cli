import React from 'react'

/**
 *
 * @param pageId {number | string} 页面id
 * @param trackerType {number | string} 上报类型 {浏览: 10000 | 点击: 20000}
 * @param eventId {number | string} 事件id
 * @param param {sting} 上报参数
 */
const tracker = (pageId, trackerType, eventId, param) => WrapperdComponent =>  {

    return class extends React.Component {

      componentDidMount() {
        this.handlerTracker(pageId, trackerType, eventId, param)
      }

      handlerTracker = (pageId, trackerType, eventId, param) => {
        if (pageId && trackerType && eventId && !!window.tracker)
          window.track._launch(pageId, trackerType, eventId, param)
      }

      render() {
        return <WrapperdComponent { ...this.props } tracker={this.handlerTracker} />
      }
    }
  }

export default tracker
