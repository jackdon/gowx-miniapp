import { Component } from "react";
import Taro from "@tarojs/taro";
import { View, Image, Text } from "@tarojs/components";
import { AtButton } from "taro-ui";

import gopher from "../../../public/img/gopher_head.png";
import "./index.scss";

// #region 书写注意
//
// 目前 typescript 版本还无法在装饰器模式下将 Props 注入到 Taro.Component 中的 props 属性
// 需要显示声明 connect 的参数类型并通过 interface 的方式指定 Taro.Component 子类的 props
// 这样才能完成类型检查和 IDE 的自动提示
// 使用函数模式则无此限制
// ref: https://github.com/DefinitelyTyped/DefinitelyTyped/issues/20796
//
// #endregion

type PageStateProps = {};

type PageDispatchProps = {};

type PageOwnProps = {};

type PageState = {};

type IProps = PageStateProps & PageDispatchProps & PageOwnProps;

interface Index {
  props: IProps;
}

class Index extends Component {
  /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */

  componentWillReceiveProps(nextProps) {
    console.log(this.props, nextProps);
  }

  componentWillUnmount() {}

  componentDidShow() {}

  componentDidHide() {}

  handleGotoList = () => {
    Taro.navigateTo({
      // url: "/pages/example-list/index"
      url: "/pages/lesson/index"
    });
  };

  onShareAppMessage() {
    return {
      title: "Golang代码示例",
      path: "/pages/index/index"
    };
  }

  render() {
    return (
      <View className="index">
        <Image className="gopher" src={gopher}></Image>
        <View className="go-btn">
          <AtButton onClick={this.handleGotoList}>开始Go之旅</AtButton>
        </View>

        <View className="ft">
          <Text>Copyright © 2020. All Rights Reserved</Text>
          <View>
            <Text
              className="link"
              onClick={() => {
                Taro.navigateTo({
                  url: `/pages/about/index`
                });
              }}
            >
              关于
            </Text>
            <Text
              className="link"
              onClick={() => {
                Taro.navigateTo({
                  url: `/pages/about/feedback/index`
                });
              }}
            >
              提交反馈
            </Text>
          </View>
        </View>
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

export default Index;
