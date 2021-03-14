/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/sort-comp */
import { Component } from "react";
import Taro from "@tarojs/taro";
import { View, RichText, Button, Text, Image } from "@tarojs/components";
import { connect } from "react-redux";
import {
  AtModal,
  AtModalAction,
  AtModalHeader,
  AtModalContent,
  AtIcon,
} from "taro-ui";
import qs from "querystring";

import Loading from "../../Loading";
import SectionPaging from "./SectionPaging";

import {
  fetchSectionPaging,
  fetchSectionDetail,
  toggleRunningCodeChange,
  toggleExecCode,
  clearDebugConsole,
} from "../../../../actions/lesson";

import "./index.scss";

type DebugPageStateProps = {
  debugPage: {
    loading: boolean;
    current: { id: string; title: string; content: string; files: any[] };
    sections: any[];
    runningCode: string;
    runningResult: any;
    runningEnd: any;
    running: boolean;
  };
  section: {
    list: any[];
  };
};

type DebugPageDispatchProps = {
  clearList: () => any;
  fetchList: (lessonId, isRefresh) => any;
  loadSectionDetail: (id) => any;
  onRunningCodeChange: (code) => any;
  onExecCodeClick: () => any;
  onClearConsole: () => any;
};

type DebugPageOwnProps = {};

type DebugPageState = {};

type IProps = DebugPageStateProps & DebugPageDispatchProps & DebugPageOwnProps;

interface DebugPage {
  props: IProps;
  $preload: any;
}

function addH2Class(html) {
  return html.replace("<h2>", '<h2 class="h2">');
}
function addCodeClass(html) {
  return html.replace(/<code>/g, '<code class="code">');
}
function addPreClass(html) {
  return html.replace(/<pre>/g, '<pre class="pre">');
}
function withWrapper(html) {
  if (!html) return html;
  return `<div class="debug_code">${addH2Class(
    addPreClass(addCodeClass(html))
  )}</div>`;
}

@connect(
  (state) => ({
    debugPage: state.lesson.debugPage,
    section: state.lesson.section,
  }),
  (dispatch) => ({
    fetchList(id, isRefresh) {
      dispatch(fetchSectionPaging(id, isRefresh));
    },
    loadSectionDetail(id) {
      dispatch(fetchSectionDetail(id));
    },
    onRunningCodeChange(code) {
      dispatch(toggleRunningCodeChange(code));
    },
    onExecCodeClick() {
      dispatch(toggleExecCode(null, null));
    },
    onClearConsole() {
      dispatch(clearDebugConsole());
    },
  })
)
class DebugPage extends Component {
  /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */
  state = { showPost: false, userInfo: {}, imgLoading: true };

  componentDidMount() {
    const { current } = this.props.debugPage;
    const { loadSectionDetail, onClearConsole } = this.props;
    console.log("加载课程详情");
    if (current && current.id) {
      loadSectionDetail(current.id);
    }
    onClearConsole();
  }

  componentWillReceiveProps(nextProps) {
    console.log(this.props, nextProps);
  }

  componentWillUnmount() {}

  componentDidShow() {}

  componentDidHide() {}

  handleDebugClicked = (runningCode, e) => {
    this.props.onRunningCodeChange(runningCode);
    Taro.navigateTo({
      url: `/pages/lesson/debug/index`,
    });
  };

  onExecClick = () => {
    this.props.onExecCodeClick();
  };

  onClearClick = () => {
    this.props.onClearConsole();
  };

  handlePageChange = (curSec) => {
    const { loadSectionDetail } = this.props;
    if (loadSectionDetail) {
      loadSectionDetail(curSec.id);
    }
  };

  handleShareClick = (e) => {
    console.log("分享");
    console.log(e);
    this.setState({ showPost: true });
  };

  handleOnGetUserInfo = ({ detail, ...others }) => {
    console.log(detail);
    console.log(others);
    this.setState({ showPost: true, userInfo: detail.userInfo });
  };

  render() {
    const { showPost, userInfo, imgLoading } = this.state;
    const { loading, current } = this.props.debugPage;
    const { list = [] } = this.props.section;
    const canFull = !current || !current.files || current.files.length === 0;

    const encodeImgURL = (id = "5ecc74331dc62aabd37273b5") => {
      const { nickName, avatarUrl } = userInfo as any;
      if (nickName && avatarUrl) {
        return (
          `https://goexa.qiiso.com/sandbox/share/page/${id}?` +
          qs.stringify({ nick: nickName, avatar: avatarUrl })
        );
      }
      return "";
    };
    return (
      <View className="debug-page__container">
        {loading && <Loading loading={loading} loadingText="正在加载..." />}
        <View className="share">
          <Button
            className="share btn close"
            openType="getUserInfo"
            onClick={this.handleShareClick.bind(this)}
            onGetUserInfo={this.handleOnGetUserInfo.bind(this)}
          >
            <AtIcon value="share" size="16"></AtIcon>
          </Button>
          {current && showPost && (
            <AtModal isOpened={showPost}>
              <AtModalHeader>
                <Text className="title">
                  {imgLoading ? "正在加载海报..." : "分享"}
                </Text>
                <Button
                  onClick={() =>
                    this.setState({ ...this.state, showPost: false })
                  }
                  className="close"
                >
                  <AtIcon value="close" size="20"></AtIcon>
                </Button>
              </AtModalHeader>
              <AtModalContent>
                {imgLoading && (
                  <Loading loading={imgLoading} loadingText="正在加载..." />
                )}
                <Image
                  showMenuByLongpress
                  style={{ width: "100%" }}
                  mode="widthFix"
                  onLoad={() => {
                    this.setState({ imgLoading: false });
                  }}
                  src={encodeImgURL(current.id)}
                ></Image>
              </AtModalContent>
            </AtModal>
          )}
        </View>

        <View className="pagination">
          <SectionPaging
            current={list.findIndex((s) => s.id === current.id)}
            onPageChange={this.handlePageChange.bind(this)}
            sections={list}
          />
        </View>
        <View className={`debug-page__content ${canFull ? "full" : ""}`}>
          {current && (
            <RichText
              style={{ padding: "1rem" }}
              nodes={withWrapper(current.content)}
            ></RichText>
          )}
        </View>
        {!canFull && (
          <View className="debug-page__debug">
            <Button
              onClick={this.handleDebugClicked.bind(
                this,
                current ? current.files[0].content : ""
              )}
              className="btn-run"
              disabled={false}
              size="mini"
            >
              <Text className="at-fab__icon at-icon at-icon-play"></Text>
              运行
            </Button>
          </View>
        )}
        <View className="debug-page__code">
          {current && current.files && (
            <RichText nodes={current.files[0].content_hl}></RichText>
          )}
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

export default DebugPage;
