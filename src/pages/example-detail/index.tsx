/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/sort-comp */
import { ComponentClass } from "react";
import Taro, { Component, Config, ShareAppMessageObject } from "@tarojs/taro";
import { View, RichText, Text, Button } from "@tarojs/components";
import { AtFab } from "taro-ui";
import { connect } from "@tarojs/redux";
import qs from "querystring";

import {
  fetchExampleDetail,
  changeExampleShowMode
} from "../../actions/detail";
import DocsHeader from "../components/doc-header";

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

type PageStateProps = {
  exampleDetail: {
    loading: boolean;
    data: any;
    showMode: boolean;
  };
};

type PageDispatchProps = {
  fetchExample: (id: string) => any;
  toggleShowMode: (mode: boolean) => any;
};

type PageOwnProps = {};

type PageState = {};

type IProps = PageStateProps & PageDispatchProps & PageOwnProps;

interface Index {
  props: IProps;
}

@connect(
  ({ exampleDetail }) => ({
    exampleDetail
  }),
  dispatch => ({
    fetchExample(id: string) {
      dispatch(fetchExampleDetail(id));
    },
    toggleShowMode(mode: boolean) {
      dispatch(changeExampleShowMode(mode));
    }
  })
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
    navigationBarTitleText: "Golang 学习",
    enablePullDownRefresh: false
  };

  componentDidMount() {
    const { fetchExample } = this.props;
    const { name, _id } = this.$router.params;
    Taro.setNavigationBarTitle({
      title: this.config.navigationBarTitleText + " - " + name
    });
    fetchExample(_id);
  }

  componentWillReceiveProps(nextProps) {
    console.log(this.props, nextProps);
  }

  // componentWillUnmount() {}

  // componentDidShow() {}

  // componentDidHide() {}

  onShareAppMessage(obj: ShareAppMessageObject) {
    const { name, _id } = this.$router.params;
    return {
      title: "请查收一份代码分享",
      path: "/pages/example-detail/index?" + qs.stringify({ name, _id })
    };
  }

  render() {
    const { toggleShowMode } = this.props;
    const { data, showMode } = this.props.exampleDetail;
    const { share, name } = this.$router.params;
    const exampleOptions = [
      {
        title: "注释",
        checked: showMode,
        onChange: value => {
          toggleShowMode(value);
        }
      }
    ];
    return (
      <View className="page index">
        {share ? null : (
          <DocsHeader title="示例代码" desc={name} options={exampleOptions} />
        )}
        {data && (
          <RichText
            nodes={showMode ? data.highlight_code : data.highlight_code_clean}
          ></RichText>
        )}
        <DocsHeader title="运行结果" desc="" />
        {data && data.run_docs && <RichText nodes={data.run_docs}></RichText>}
        <DocsHeader title="说明" desc="" />
        <View className="doc-body panel">
          {data && data.segs && data.segs[0] && (
            <View className="at-article">
              <View className="at-article__p">
                {/* {data.segs[0].map(s => s.docs).join("\n")} */}
                {/* {data.go_code_markup} */}
              </View>
              <RichText nodes={data.docs_markup}></RichText>
            </View>
          )}
        </View>
        <AtFab className="btn-fab">
          <Button openType="share" className="btn-share">
            <Text className="at-fab__icon at-icon at-icon-share" style={{color: "#fefefe"}}></Text>
          </Button>
        </AtFab>
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
