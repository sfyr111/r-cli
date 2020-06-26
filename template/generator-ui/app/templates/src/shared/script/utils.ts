import Cookie from 'js-cookie';
import BigNumber from 'bignumber.js';
import qs from 'qs';
const md5 = require('md5');

export const bg = (value: any) => new BigNumber(value);

// iPhone X、iPhone XS
export const isIPhoneX =
  /iphone/gi.test(window.navigator.userAgent) &&
  window.devicePixelRatio &&
  window.devicePixelRatio === 3 &&
  window.screen.width === 375 &&
  window.screen.height === 812;
// iPhone XS Max
export const isIPhoneXSMax =
  /iphone/gi.test(window.navigator.userAgent) &&
  window.devicePixelRatio &&
  window.devicePixelRatio === 3 &&
  window.screen.width === 414 &&
  window.screen.height === 896;
// iPhone XR
export const isIPhoneXR =
  /iphone/gi.test(window.navigator.userAgent) &&
  window.devicePixelRatio &&
  window.devicePixelRatio === 2 &&
  window.screen.width === 414 &&
  window.screen.height === 896;

export const source = Cookie.get('source');
export const isAndroid = source === 'android';
export const isIOS = source === 'ios';
export const isApp = isAndroid || isIOS;
export const isWeixin = /MicroMessenger/i.test(navigator.userAgent);
export const appVersion = Cookie.get('version');

export const fixAndroidText = {
  position: 'relative',
  top: isAndroid ? '.03rem' : 'auto'
} as React.CSSProperties;

/*
* Javascript base64encode() base64加密函数
用于生成字符串对应的base64加密字符串
* @param string input 原始字符串
* @return string 加密后的base64字符串
*/
function base64_encode(input: string): string {
  let rv;
  rv = encodeURIComponent(input);
  rv = unescape(rv);
  rv = window.btoa(rv);
  return rv;
}
/*
* Javascript base64Decode() base64解密函数
用于解密base64加密的字符串
* @param string input base64加密字符串
* @return string 解密后的字符串
*/
function base64_decode(input: string): string {
  let rv;
  rv = window.atob(input);
  rv = escape(rv);
  rv = decodeURIComponent(rv);
  return rv;
}

export { base64_encode, base64_decode };

export function isMobilephoneNumber(num: any) {
  return /^1\d{10}$/.test(num);
}

export function isLegalPassport(string: any) {
  return /((?=.*\d)(?=.*\D)|(?=.*[a-zA-Z])(?=.*[^a-zA-Z]))(?!^.*[\u4E00-\u9FA5].*$)^\S{6,16}$/.test(
    string
  );
}
export function isEmail(string: any) {
  return /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/.test(string);
}

export function isPhoneNumber(num: any) {
  // return /^(0[0-9]{2,3}\-)?([2-9][0-9]{6,7})+(\-[0-9]{1,4})?$/.test(num)
  return /^(0[0-9]{2,3}\-)?\d+$/.test(num);
}

export function sleep(time: number) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

export function getQueryObjForSearch(search: string) {
  return qs.parse(search, { ignoreQueryPrefix: true });
}

export function genQueryStringForObj(obj: { [key: string]: any }) {
  return '?' + qs.stringify(obj);
}

// const formatCents = (value: string | number) => Math.floor((Number(value) / 100) * 100) / 100
export const formatCents = (value: string | number | undefined) => Math.floor(Number(value)) / 100;

export const formatWeight = (value: string | number | undefined, c = 1000) =>
  Math.floor(Number(value)) / c;

export function publicPath() {
  return '/m/lsgc/write-off';
}

export function goHome() {
  window.kwapp && window.kwapp.goHome();
}

export function getQueryString(name: string) {
  let reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
  let r = window.location.search.substr(1).match(reg);
  if (r != null) return unescape(r[2]);
  return null;
}

export const genCashSignStr = ({ sign, ...params }: { [k: string]: any }) => {
  if (!params || typeof params !== 'object') return '';
  const SIGN = 'bbcashier';
  const keys = Object.keys(params).sort();
  const formatParams =
    SIGN +
    keys.reduce((pre: string, cur: string) => {
      if (typeof params[cur] === 'object') pre += cur + JSON.stringify(params[cur]);
      else pre += cur + String(params[cur]);
      return pre;
    }, '');
  // console.log(formatParams)
  return md5(formatParams);
};

export const scan = () => {
  return new Promise((resolve, reject) => {
    window.kwapp &&
      window.kwapp.scanQr({
        callback: (result: any) => {
          console.log('scan: ', result);
          return resolve(result);
        }
      });
  });
};
