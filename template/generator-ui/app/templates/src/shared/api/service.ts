import axios, { AxiosRequestConfig } from 'axios'
import qs from 'qs'

axios.defaults.baseURL = process.env.API_BASE || ''

// axios.defaults.headers.common['Access-Control-Allow-Origin'] = 'dev.cekid.com'

axios.interceptors.request.use((config: any) => {
  // console.log(config)
  return config
})

axios.interceptors.response.use((response: any) => {
  return response
})

function parseResponse(response: any) {
  return Promise.all([response.status, response.statusText, response.data])
}

interface IError extends Error {
  status?: any
  error_message?: any
}

function checkStatus(args: any) {
  const [status, statusText, data] = args
  if (status >= 200 && status < 300) {
    return data
  } else {
    const error: IError = new Error(statusText)
    error.status = status
    error.error_message = data
    return Promise.reject(error)
  }
}

// import api from 'service'
// api.get({ url: 'xxxx.xxx.xx', { a: 1, b: 2 } })
// api.post({ url: 'xxxx.xxx.xx', { a: 1, b: 2 } }) // x-form
// api.post({ url: 'xxxx.xxx.xx', { a: 1, b: 2 }, { isJson: true } }) // json

const methods = ['get', 'delete', 'post', 'patch', 'put']
const serviceObj: { get: any; delete: any; post: any; patch: any; put: any } = methods.reduce(
  (obj: any, method: string) => ({
    ...obj,
    [method]: (url: string, data: any, { isJson = false, withCredentials = true, ...config } = {}) =>
      method === 'get' || method === 'delete'
        ? axios({ method, url, params: data, withCredentials, timeout: 10000, headers: {}, ...config } as AxiosRequestConfig)
            .then((response: any) => response)
            .then(parseResponse)
            .then(checkStatus)
        : axios({
            method,
            url,
            data: isJson ? JSON.stringify(data) : qs.stringify(data),
            withCredentials,
            timeout: 10000,
            headers: { 'Content-Type': isJson ? 'application/json' : 'application/x-www-form-urlencoded; charset=UTF-8' },
            ...config,
          } as AxiosRequestConfig)
            .then((response: any) => response)
            .then(parseResponse)
            .then(checkStatus),
    // : axios({ method, url, data: qs.stringify(data), withCredentials: false, timeout: 20000, headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }, ...config })
  }),
  {}
)

export default serviceObj
