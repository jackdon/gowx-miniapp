/* eslint-disable react/sort-comp */
import { ComponentClass } from "react";
import Taro, { Component, Config } from "@tarojs/taro";
import { View } from "@tarojs/components";
import { connect } from "@tarojs/redux";
import qs from "querystring";

import Loading from "../../components/Loading";
import LessonSection from "../../components/LessonSection";
import LessonPaging from "./lesson-paging";

import { fetchLessonPaging, changeSelectLesson } from "../../../actions/lesson";

import "./index.scss";
import "../../components/LessonSection/index.scss";

type GalleryStateProps = {
  lesson: {
    gallery: {
      list: any[];
      pagination: any;
      loading: boolean;
      selectIndex: number;
    };
  };
};

type GalleryDispatchProps = {
  clearList: () => any;
  fetchList: (page?: string) => any;
  onSelectChange: (lesson, selectIndex) => any;
};

type GalleryOwnProps = {};

type GalleryState = {};

type IProps = GalleryStateProps & GalleryDispatchProps & GalleryOwnProps;

interface Gallery {
  props: IProps;
}

@connect(
  ({ lesson }) => ({
    lesson
  }),
  dispatch => ({
    fetchList(page?: string) {
      dispatch(fetchLessonPaging(page));
    },
    onSelectChange(lesson, selectIndex) {
      dispatch(changeSelectLesson(selectIndex));
    }
  })
)
class Gallery extends Component {
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
    if (fetchList) {
      fetchList("0");
    }
  }

  /* componentWillReceiveProps(nextProps) {
    console.log(this.props, nextProps);
  } */

  componentWillUnmount() {}

  componentDidShow() {}

  componentDidHide() {}

  handleOpenExampleDetail = ({ _id, name }) => {
    Taro.navigateTo({
      url: `/pages/example-detail/index?${qs.stringify({ name, _id })}`
    });
  };

  handleGalleryCardClick = idx => {
    if (idx === 0) {
      Taro.navigateTo({
        url: `/pages/example-list/index`
      });
    } else {
      Taro.navigateTo({
        url: `/pages/lesson/sandbox`
      });
    }
  };

  onNextPageClick = () => {
    const { fetchList, lesson } = this.props;
    fetchList(lesson.gallery.pagination.next);
  };

  onPrevPageClick = () => {
    const { fetchList, lesson } = this.props;
    fetchList(lesson.gallery.pagination.prev);
  };

  onLessonClick = (lesson, selectIndex) => {
    // Taro.showToast({title: lesson.title + ":" + selectIndex, icon: "none"})
    this.props.onSelectChange(lesson, selectIndex);
  };

  render() {
    const {
      loading,
      pagination,
      list,
      selectIndex
    } = this.props.lesson.gallery;
    const selectLesson = list.length > 0 ? list[selectIndex] : {};
    return (
      <View className="index">
        {loading && <Loading loading={loading} loadingText="正在加载..." />}
        <View className="gallery_content">
          <View className="lesson__content">
            <View className="lesson__title">{selectLesson.title || ""}</View>
            <View className="lesson__category">
              {selectLesson.category || ""}
            </View>
            <View className="lesson__desc">
              {selectLesson.description || ""}
            </View>
            <View className="lesson__time">
              {(selectLesson.create_time || "").substring(0, 10)}
            </View>
          </View>
          {selectLesson && (
            <LessonSection lessonId={selectLesson.id} onlyList />
          )}
          <LessonPaging
            lessons={list}
            onLessonClick={this.onLessonClick}
            onNextPageClick={this.onNextPageClick.bind(this)}
            onPrevPageClick={this.onPrevPageClick.bind(this)}
            pagination={{ ...pagination }}
            selectIndex={selectIndex}
            loading={loading}
          />
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

export default Gallery as ComponentClass<GalleryOwnProps, GalleryState>;
