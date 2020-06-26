import { getHost } from '../config/constant';

const APP_DOMAIN = getHost('app');

export default {
  // 加载收银台
  loadCashier: `${APP_DOMAIN}/retailpos/api/cash/loadCashier.do`,
  // 加载支付列表
  getPaymentList: `${APP_DOMAIN}/retailpos/api/cash/getPaymentList.do`,
  // 预支付
  prePayList: `${APP_DOMAIN}/retailpos/api/cashPay/prePayList.do`,
  // 统一支付
  tongyizhifu: `${APP_DOMAIN}/retailpos/api/cashPay/tongYiZhiFu.do`,
  // 支付回写
  paidBackWrite: `${APP_DOMAIN}/retailpos/api/cashPay/paidBackWrite.do`,
  // 支付上报
  reportPayment: `${APP_DOMAIN}/retailpos/api/cash/reportPayment.do`,
  // 取消支付
  cancelNormalPay: `${APP_DOMAIN}/retailpos/api/cashPay/cancelNormalPay.do`,
  // 查询销售主单（含详情）
  getFatherSaleBill: `${APP_DOMAIN}/cjy/hxlmomdi/api/saleOrder/getFatherSaleBill.do`,
  updateWriteOff: `${APP_DOMAIN}/possubmit/WriteOff`,
  createSubOrder: `${APP_DOMAIN}/possubmit/CreateSubOrder`,
  modifyPickOrder: `${APP_DOMAIN}/possubmit/ModifyPickOrder`,
  // 保存包裹上架信息
  savePackageShelves: `${APP_DOMAIN}/cjy/hxlmomdi/api/logisticsBox/savePackageShelves.do`,
  // 获取自提点列表
  getPackageDeliverList: `${APP_DOMAIN}/bmc/pickup/queryList.do`,
  // 包裹签收
  signPackage: `${APP_DOMAIN}/cjy/hxlmomdi/api/logisticsBox/logisticsBoxSign.do`,
  // 获取物流箱信息
  getPackageDetail: `${APP_DOMAIN}/cjy/hxlmomdi/api/logisticsBox/getLogisticsboxDetail.do`,
  // 加载口碑门店列表
  getKbStoreList: `${APP_DOMAIN}/retail-web/api/pgEmp/queryUserDetail.do`,
  // 核销商品
  writeOffGoods: `${APP_DOMAIN}/ros/pyram/kbms/writeoff/writeOffGoods.do`,
  // 通过券码查核销信息
  writeOffInfoByPos: `${APP_DOMAIN}/ros/pyram/kbms/writeoff/getWriteOffInfoByPos.do`
};
