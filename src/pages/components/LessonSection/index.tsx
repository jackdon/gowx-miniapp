/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/sort-comp */
import { Component } from "react";
import Taro from "@tarojs/taro";
import { View, Text } from "@tarojs/components";
import { AtList, AtListItem } from "taro-ui";
import { connect } from "react-redux";

import Loading from "../Loading";
import {
  fetchSectionPaging,
  toggleDebugPageInit,
} from "../../../actions/lesson";

import "./index.scss";

type LessonSectionStateProps = {
  section: {
    loading: boolean;
    list: [];
    pagination: {
      page: number;
      perPage: number;
      totalPage: number;
      total: number;
      next: number;
      prev: number;
    };
  };
};

type LessonSectionDispatchProps = {
  clearList: () => any;
  fetchList: (lessonId, isRefresh) => any;
  toggleDebugPageInit: (args) => any;
};

type LessonSectionOwnProps = {
  lessonId: string;
  onLoadMoreClick?: () => void;
  // 只显示列表，精简版
  onlyList: boolean;
};

type LessonSectionState = {};

type IProps = LessonSectionStateProps &
  LessonSectionDispatchProps &
  LessonSectionOwnProps;

interface LessonSection {
  props: IProps | any;
}

@connect(
  (state) => ({
    section: state.lesson.section,
  }),
  (dispatch) => ({
    fetchList(id, isRefresh) {
      dispatch(fetchSectionPaging(id, isRefresh));
    },
    toggleDebugPageInit(args) {
      dispatch(toggleDebugPageInit(args));
    },
  })
)
class LessonSection extends Component {
  /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */

  componentDidMount() {
    const { lessonId, fetchList, onlyList } = this.props;
    fetchList(lessonId, onlyList);
  }

  componentWillReceiveProps(nextProps) {
    console.log(this.props, nextProps);
    const { lessonId, fetchList, onlyList } = this.props;
    if (lessonId !== nextProps.lessonId) {
      fetchList(nextProps.lessonId, onlyList);
    }
  }

  componentWillUnmount() {}

  componentDidShow() {}

  componentDidHide() {}

  onSectionClick = (sections, current, e) => {
    this.props.toggleDebugPageInit({ cb: () => {}, sections, current });
    console.log("打开调试页面", current);
    Taro.navigateTo({
      url: `/pages/components/LessonSection/DebugPage/index`,
    });
  };

  render() {
    const { loading, pagination, list = [] } = this.props.section;
    /*     const {
      page = 0,
      perPage = 10,
      totalPage = 0,
      total = 0,
      prev = 0,
      next = 0
    } = pagination || {}; */
    return (
      <View className="lesson-section__container">
        {loading && <Loading loading={loading} loadingText="正在加载..." />}
        <View className="pagination">
          <AtList>
            {list.map((s: any, idx) => (
              <AtListItem
                onClick={this.onSectionClick.bind(this, list, s)}
                key={`sec_${idx}`}
                title={s.title}
                note="调试"
                arrow="right"
              />
            ))}
          </AtList>
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

export default LessonSection;
