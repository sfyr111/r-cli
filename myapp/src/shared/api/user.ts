import api from './service'
import { getHost } from '../config/constant'
import { Auth } from "../config/type";
import {base64_encode} from "../script/utils";

const APP_CODE = 'user'
export const BUS_ID_LOGIN = '101';    // login
export const BUS_ID_REGISTER = '102'; // register
export const BUS_ID_PASSWORD = '103'; // password modification
// 登录
export const fetchLoginByAccount = ({ loginaccount, passwd }: { loginaccount: string, passwd: string }) => api.post(`${getHost('user')}/user/LoginByBindInfo`, { loginaccount, passwd, loginfrom: '3' })

// 注册
export const fetchRegisterByAccount = ({ registeraccount, password, verifycode }: { registeraccount: string, password: string, verifycode: string }) => api.post(`${getHost('user')}/user/RegisterByBindInfo`, { registeraccount, password, verifycode, accounttype: 1, bus_id: BUS_ID_REGISTER })

// 修改用户名
export const fetchModifyBasicUserInfo = ({ uid, skey, nick }: { nick: string } & Auth) => api.post(`${getHost('user')}/user/ModifyBasicUserInfo`, { uid, skey, nick })

// 检查登录信息状态
export const fetchCheckLogin = ({ uid, skey }: Auth) => api.get(`${getHost('user')}/user/user/CheckLogin`, { uid, skey })

// 获取图形验证码
export const fetchPictureCode = (pvid: string) => `${getHost('verifycode')}/ucode-web/ucode/getNumber.do?identity=${pvid}&appCode=${base64_encode(APP_CODE)}&appServiceCode=${base64_encode(BUS_ID_LOGIN)}&rand=v-${new Date().getTime()}`

export const fetchVerifyCode = ({ mobile, pvid, pvstr }: { mobile: string, pvid: string, pvstr: string }) => api.get(`${getHost('vc')}/sendverifycode/sendverifycode`, { bus_id: BUS_ID_LOGIN, mobile, appcode: APP_CODE, pvid, pvstr, tem_id: 1001 })

// 验证码登录
export const fetchRegisterAndLoginByVerifyCode = ({ loginaccount, verifycode }: { loginaccount: string, verifycode: string }) => api.post(`${getHost('user')}/user/LoginByVerifyCode`, { loginaccount, verifycode, loginfrom: 3, bus_type: 3024, bus_id: BUS_ID_LOGIN })

export const fetchUserInfo = ({ uid, skey }: Auth) => api.get(`${getHost('user')}/user/GetUserInfo`, { uid, skey })
// export const fetchEnteringInfo = ()

export const fetchLogout = ({ uid, skey }: Auth) => api.get(`${getHost('user')}/user/Logout`, { uid, skey })

