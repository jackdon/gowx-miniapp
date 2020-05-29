/* eslint-disable no-unused-vars */
import { ComponentClass } from "react";
import Taro, { Component, Config, ShareAppMessageObject } from "@tarojs/taro";
import { View, Image } from "@tarojs/components";
import { connect } from "@tarojs/redux";

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

@connect(
  () => ({}),
  () => ({})
)
class Index extends Component {
  /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */
  config: Config = {
    navigationBarTitleText: "关于"
  };

  componentWillReceiveProps(nextProps) {
    console.log(this.props, nextProps);
  }

  componentWillUnmount() {}

  componentDidShow() {}

  componentDidHide() {}

  handleGotoList = () => {
    Taro.navigateTo({
      url: "/pages/example-list/index"
    });
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onShareAppMessage(obj: ShareAppMessageObject) {
    return {
      title: "Golang代码示例",
      path: "/pages/about/index"
    };
  }

  onCopyToClipboard = (obj) => {
    Taro.setClipboardData({
      data: obj,
      success: function() {
        Taro.getClipboardData({
          success: function() {
            Taro.showToast({
              title: "已复制",
              icon: "none"
            });
          }
        });
      }
    });
  };

  render() {
    const linkMiniapp = "https://github.com/jackdon/gowxapi";
    const linkAppApi = "https://github.com/jackdon/gowx-miniapp";
    return (
      <View className="index">
        <Image className="gopher" src={gopher}></Image>
        <View className="intro at-article">
          <View className="text">
            Go是一种开放源代码编程语言，旨在构建简单，快速且可靠的软件。 Go by
            Example是使用带注释的示例程序的动手入门。
          </View>
          <View className="text">
            本项目仅用于学习、分享最简单易懂的GO代码片段。
          </View>
        </View>

        <View className="proj">
          <View
            onClick={this.onCopyToClipboard.bind(this, linkAppApi)}
            className="link"
          >
            {linkAppApi}
          </View>
          <View
            onClick={this.onCopyToClipboard.bind(this, linkMiniapp)}
            className="link"
          >
            {linkMiniapp}
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

export default Index as ComponentClass<PageOwnProps, PageState>;
