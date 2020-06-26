const http = window.location.protocol ? `${window.location.protocol}//` : 'http://'

const isDevelopment = process.env.NODE_ENV === 'development'

export const DOMAIN = document.domain.split('.').slice(-2).join('.') || 'retailo2o.com'

const prefix = document.domain.split('.')[0]

export const getHost = (name: string) => `${http}${isDevelopment ? prefix : name}.${DOMAIN}` + (isDevelopment ? '/_dev_proxy' : '')

// export const getHost = (prefix: string) => `//${prefix}.haiziwang.com`

// export const getHost = (prefix: string) => ``
// export const DOMAIN = 'haiziwang.com'

export const POP_ENTERING = 'pop-entering'

export const GLOBAL_ENTERING = 'global-entering'

export const SELF_COOPERATION = 'self-cooperation'

export const OFFLINE_COOPERATION = 'offline-cooperation'

export const purposeMap = new Map([
  [POP_ENTERING, 1],
  [GLOBAL_ENTERING, 2],
  [SELF_COOPERATION, 3],
  [OFFLINE_COOPERATION, 4],
])

export const purposeObj: any = {
  '1': POP_ENTERING,
  '2': GLOBAL_ENTERING,
  '3': SELF_COOPERATION,
  '4': OFFLINE_COOPERATION,
}

/**
 *
 * @param {string} path
 * @returns '1' | '2' | '3' | '4' | undefined
 */
export const findPurposeByPath = (path: string) => {
  const list = Object.entries(purposeObj).find((item: any) => item[1] === path)
  return list && list[0]
}
