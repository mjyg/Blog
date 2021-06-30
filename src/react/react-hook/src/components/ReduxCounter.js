import React from "react";
import { connect } from "react-redux";
import { add, reduce } from "../store/actions/counterAction";
import { fetchData } from "../store/actions/dataAction";

//state到props的映射,建立组件和state的映射关系
function mapStateToProps(state) {
  return {
    count: state.counter.count,
    data: state.data.data,
    loading: state.data.loading,
    error: state.data.error,
  };
}

//将dispatch函数映射到props
const mapDispatchToProps = {
  add,
  reduce,
  fetchData,
};

class ReduxCounter extends React.Component {
  handleAdd = () => {
    // 通过props拿到dispatch方法
    // this.props.dispatch(add());

    //使用mapDispatchToProps作为connect的第二个参数，可以这样调用dispatch方法
    this.props.add();
  };

  handleReduce = () => {
    // this.props.dispatch(reduce());
    this.props.reduce();
  };

  componentDidMount() {
    // this.props.fetchData().then((res) => {
    //   console.log("获取到接口数据");
    // });
  }

  render() {
    const { error, loading, data } = this.props;
    if (error) {
      return <div>页面加载出错:{error}</div>;
    }
    if (loading) {
      return <div>页面加载中...</div>;
    }
    return (
      <div>
        <h3>我是counter组件</h3>
        <div>{data}</div>
        <div>
          {/*通过props拿到count值*/}
          <p>{this.props.count}</p>
          <button onClick={this.handleAdd}>加一</button>
          <button onClick={this.handleReduce}>减一</button>
        </div>
      </div>
    );
  }
}

// 使用connect函数包裹ReduxCounter，实现React和Redux的连接
// 传入mapStateToProps这个参数后，组件便会订阅store中状态的变化
// connect是高阶函数
export default connect(mapStateToProps, mapDispatchToProps)(ReduxCounter);
