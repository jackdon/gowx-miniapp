/* eslint-disable react/sort-comp */
import { ComponentClass } from "react";
import Taro, { Component, Config } from "@tarojs/taro";
import { View, Text, Button } from "@tarojs/components";
// import { AtList, AtListItem, AtDivider } from "taro-ui";
import { connect } from "@tarojs/redux";
import qs from "querystring";

import Loading from "../components/Loading";
import { fetchSandboxList } from "../../actions/lesson";

import "./index.scss";

type LessonStateProps = {
  lesson: {
    sandbox: {
      list: any[];
      pagination: any;
      loading: boolean;
    }
  };
};

type LessonDispatchProps = {
  clearList: () => any;
  fetchList: () => any;
};

type LessonOwnProps = {};

type LessonState = {};

type IProps = LessonStateProps & LessonDispatchProps & LessonOwnProps;

interface Lesson {
  props: IProps;
}

@connect(
  ({ lesson }) => ({
    lesson
  }),
  dispatch => ({
    fetchList() {
      dispatch(fetchSandboxList());
    }
  })
)
class Lesson extends Component {
  /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */
  config: Config = {
    navigationBarTitleText: "Golang Code Sandbox",
    enablePullDownRefresh: false
  };

  componentDidMount() {
    const { fetchList } = this.props;
    fetchList();
  }

  componentWillReceiveProps(nextProps) {
    console.log(this.props, nextProps);
  }

  componentWillUnmount() {}

  componentDidShow() {}

  componentDidHide() {}

  handleOpenExampleDetail = ({ _id, name }) => {
    Taro.navigateTo({
      url: `/pages/example-detail/index?${qs.stringify({ name, _id })}`
    });
  };

  handleLessonCardClick = (idx, s: any) => {
    if (idx === 0) {
      Taro.navigateTo({
        url: `/pages/example-list/index`
      });
    } else {
      Taro.navigateTo({
        url: `/pages/lesson/gallery/index?category=${s.category}`
      });
    }
  }

  render() {
    const { list, loading } = this.props.lesson.sandbox;
    return (
      <View className="index">
        {loading && <Loading loading={loading} loadingText="正在加载..." />}
        <View className="lesson-card__container">
          {list.map((s, idx) => {
            return (
              <View className="lesson-card" key={`ls_${idx}`} onClick={this.handleLessonCardClick.bind(this, idx, s)}>
                <View className="at-article__h1">{s.name}</View>
                <View className="at-article__h3">{s.desc}</View>
                <View className="at-article__h3"><Text className="label">目录总数</Text>{s.dir_count}</View>
                <View className="at-article__h3"><Text className="label">文件总数</Text>{s.file_count}</View>
                <Button className="btn-run">
                  <Text className="at-fab__icon at-icon at-icon-play" style={{color: "#fefefe", marginLeft: ".2rem"}}></Text>
                </Button>
              </View>
            )
          })}
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

export default Lesson as ComponentClass<LessonOwnProps, LessonState>;
