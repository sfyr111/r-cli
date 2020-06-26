redux:

<https://www.zcfy.cc/article/redux-best-practices-kyle-poole-medium>



> http://gitlab.haiziwang.com/frontend/app-sdk/blob/master/src/index.js 
http://h5neibu.retailo2o.com/doc/tool/appsdk.html

## actions

```
export const ACTIVITY_LIST_UPDATE = 'activity/ACTIVITY_LIST_UPDATE' // 同步更新
export const SAGA_ACTIVITY_LIST_GET = 'activity/SAGA_ACTIVITY_LIST_GET' // 异步操作
```



wathcer

**异步 actions ， 和 vuex action 相似**

处理动作，处理业务，异步操作，合并同步操作

```
export const getActivityDetailSaga = createAction(types.SAGA_ACTIVITY_DETAIL_GET)


export const uploadActivityCrowdFilesSaga = createAction(types.SAGA_ACTIVITY_CROWD_FILE_UPLOAD)
```

命名方式： 动词+名词+saga

注册：注册 types



woker

执行异步，执行了 SAGA_ACTIVITY_DETAIL_GET 的 actions `getActivityDetailSaga` 执行 getActivityDetail

```

export default function* activitySaga() {
	yield takeEvery(types.SAGA_ACTIVITY_DETAIL_GET, getActivityDetail)
	yield takeLatest(types.SAGA_ACTIVITY_CROWD_FILE_UPLOAD, uploadCrowFiles))
}
```





### 同步 actions

更新 state。

```
export const updateActivityDetail = createAction(types.ACTIVITY_DETAIL_UPDATE)
```

命名方式：(update)动词+名词



reducer

```
const initState = fromJS({
 detail: {},
})
```

```
export const activity = handleActions({
  [types.ACTIVITY_DETAIL_UPDATE]: (state, action) => state.set('detail', action.payload)
}, initState)
```





## saga effects

``` 
yield call(fetch, params) // 请求 api

yield put(updateActivityPage(currentPage)) // 同步更新 action 到 state
yield put(getActivityDetailSaga) // 执行 异步 action


// vuex/module
export const selectorActivity = (state: any) => state.get('activity')
const activityState = yield select(selectorActivity) // 返回 redux 中的 state
```





## connect 组件注入



```
@(connect(
 (state: any) => ({
  list: state.getIn(['activity', 'list']), // 注入 this.props.list
  pageLoading: state.getIn(['activity', 'pageLoading']),
  listIsEmpty: state.getIn(['activity', 'listIsEmpty']),
 }),
 { getActivityDetail } // 异步或同步 action， this.props.getActivityDetail
) as any)
```

```
interface IProps extends RouteComponentProps {
 getActivityListSaga: () => void,
 list: any[],
}
```

## immutable

<http://gitlab.haiziwang.com/frontend/guide/blob/master/Seamless.md>

<https://www.jianshu.com/p/7bf04638e82a>



toJs 转成 原生 js 对象



获取 get, getIn



设置 set, setIn



更新 update, updateIn



Map, List 操作