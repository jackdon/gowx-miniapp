/* eslint-disable react/no-unused-state */
/* eslint-disable react/sort-comp */
import { Component } from "react";
import Taro, { getCurrentInstance } from "@tarojs/taro";
import { View } from "@tarojs/components";
// import { AtList, AtListItem, AtDivider } from "taro-ui";
import RunCode from "../../components/LessonSection/DebugPage/RunCode";


import "../../components/LessonSection/DebugPage/RunCode/index.scss";
import "./index.scss";

type DebugStateProps = {};

type DebugDispatchProps = {};

type DebugOwnProps = {};

type DebugState = {
  runningCode: string
};

type IProps = DebugStateProps & DebugDispatchProps & DebugOwnProps;

interface Debug {
  props: IProps;
  // $router: Taro.RouterInfo & { preload: any };
}

class Debug extends Component {
  /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */

  state = { runningCode: "" }

  router(): any {
    return getCurrentInstance().router || {};
  }

  componentWillMount() {
    console.log('preload: ', this.router().preload)
    if (this.router().preload) {
      const { runningCode } = this.router().preload
      this.setState({ runningCode })
    }
  }

  render() {
    const { runningCode = "" } = this.state;
    return (
      <View className="index">
        <RunCode run-code="run-code" runningCode={`${runningCode}`} />
      </View>
    );
  }
}

// #region 导出注意
//
// 经过上面的声明后需要将导出的 Taro.Component 子类修改为子类本身的 props 属性
// 这样在使用这个子类时 Ts 才不会提示缺少 JSX 类型参数错误
//
// #endregion

export default Debug;
