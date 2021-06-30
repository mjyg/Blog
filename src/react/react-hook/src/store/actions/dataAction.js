// thunk action: 存放一些带有副作用的action
export const FETCH_DATA_BEGIN = 'FETCH_DATA_BEGIN';
export const FETCH_DATA_SUCCESS = 'FETCH_DATA_SUCCESS';
export const FETCH_DATA_FAIL = 'FETCH_DATA_FAIL';

export const fetchDataBegin = () => ({ type: FETCH_DATA_BEGIN });
export const fetchDataSuccess = (data) => ({
  type: FETCH_DATA_SUCCESS,
  payLoad: { data },
});
export const fetchDataFail = (error) => ({
  type: FETCH_DATA_FAIL,
  payLoad: { error },
});

export function fetchData() {
  return (dispatch, getState) => {
    dispatch(fetchDataBegin());
    return fetch("http://xxx")
      .then((res) => res.json)
      .then((json) => {
        console.log("获取到接口数据", json);
        dispatch(fetchDataSuccess(json));
        return json;
      })
      .catch((err) => {
        // 捕获到错误
        dispatch(fetchDataFail(err));
      });
  };
}
