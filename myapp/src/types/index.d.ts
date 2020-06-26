interface Window {
  app: any
  localjs: any
  createshareimage: any
  kwapp: {
    goHome: () => void
    invokeShareBoard: () => void
    setTitle: (title: string) => void
    allowRefreshOrShare: (allowRefresh: boolean, allowShare: boolean) => void
    scanQr: (param: { callback: (result?: any) => void; type?: number; callbackName?: string }) => void
  }
  getAppShareInfo?: () => ShareInfo
  wx: any
  track: {
    _launch: (pageLevelID: string, logType: '10000' | '20000', eventID: string, eventParam?: string) => void
  }
  __wxjs_environment: any
  isActivePage: any
  VConsole: any
}

declare module 'rc-form'

declare module 'react-redux-immutable'

declare module 'cos-js-sdk-v5'

declare module 'uuid'

declare module 'vconsole'
