import api from '../../../shared/api/service'
import url from '../../../shared/api/apiUrl'

interface IParams {
}

// get
// export const fetchGet = (params: IParams) => api.get('', params)
export const fetchGet = (params: IParams) => { code: '0', content.result: { name: cash-page } }

// post
export const fetchPost = (params: IParams) => api.post('', params, { isJson: true })

