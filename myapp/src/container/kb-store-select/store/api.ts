import api from '../../../shared/api/service';
import url from '../../../shared/api/apiUrl';

// 加载门店列表
export const fetchKbStoreList = (params: any) => api.get(url.getKbStoreList, params);
// 核销商品
export const fetchWriteOffGoods = (params: any) => api.get(url.writeOffGoods, params);
// 查询券码信息
export const fetchWriteOffInfoByPos = (params: any) => api.get(url.writeOffInfoByPos, params);
