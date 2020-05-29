/* eslint-disable react/sort-comp */
import { ComponentClass } from "react";
import Taro, { Component, Config } from "@tarojs/taro";
import { View } from "@tarojs/components";
import { AtList, AtListItem, AtDivider } from "taro-ui";
import { connect } from "@tarojs/redux";
import qs from "querystring";

import Loading from "../components/Loading";
import { fetchExampleList } from "../../actions/index";

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
  counter: {
    num: number;
  };
  pageIndex: {
    list: any[];
    pagination: any;
    loading: boolean;
  };
};

type PageDispatchProps = {
  clearList: () => any;
  fetchList: (isFirstLoad: boolean) => any;
};

type PageOwnProps = {};

type PageState = {};

type IProps = PageStateProps & PageDispatchProps & PageOwnProps;

interface Index {
  props: IProps;
}

@connect(
  ({ counter, pageIndex }) => ({
    counter,
    pageIndex
  }),
  dispatch => ({
    fetchList(isFirstLoad: boolean) {
      dispatch(fetchExampleList(isFirstLoad));
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
    const { fetchList } = this.props;
    fetchList(true);
  }

  componentWillReceiveProps(nextProps) {
    console.log(this.props, nextProps);
  }

  componentWillUnmount() {}

  componentDidShow() {}

  componentDidHide() {}

  onReachBottom() {
    const { fetchList } = this.props;
    const { pagination } = this.props.pageIndex;
    if (pagination.next > 0) {
      fetchList(false);
    }
  }

  handleOpenExampleDetail = ({ _id, name }) => {
    Taro.navigateTo({
      url: `/pages/example-detail/index?${qs.stringify({ name, _id })}`
    });
  };

  render() {
    const { list, pagination, loading } = this.props.pageIndex;
    return (
      <View className="index">
        {loading && <Loading loading={loading} loadingText="正在加载..." />}
        <AtList>
          {list.map((e, idx) => {
            return (
              <AtListItem
                onClick={this.handleOpenExampleDetail.bind(this, e)}
                key={`example_${idx}`}
                title={e.name}
              />
            );
          })}
          {pagination.next === 0 && (
            <AtDivider className="dl" content={loading? "正在加载..." : "更多内容请持续关注～"} />
          )}
        </AtList>
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
