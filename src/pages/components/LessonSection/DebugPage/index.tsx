/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/sort-comp */
import { ComponentClass } from "react";
import Taro, { Component, Config } from "@tarojs/taro";
import { View, RichText, Button, Text } from "@tarojs/components";
import { connect } from "@tarojs/redux";
import { AtFloatLayout, AtTextarea } from "taro-ui";
import qs from "querystring";

import Loading from "../../Loading";
import SectionPaging from "./SectionPaging";

import {
  fetchSectionPaging,
  fetchSectionDetail,
  toggleRunningCodeChange,
  toggleExecCode,
  clearDebugConsole
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
  state => ({
    debugPage: state.lesson.debugPage,
    section: state.lesson.section
  }),
  dispatch => ({
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
    }
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
  config: Config = {
    navigationBarTitleText: "Golang Code Sandbox",
    enablePullDownRefresh: false
  };

  state = { isOpened: false };

  componentDidMount() {
    const { current } = this.props.debugPage;
    const { loadSectionDetail, onClearConsole } = this.props;
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

  handleOpenExampleDetail = ({ _id, name }) => {
    Taro.navigateTo({
      url: `/pages/example-detail/index?${qs.stringify({ name, _id })}`
    });
  };

  toggleOpened = () => {
    this.setState({ isOpened: !this.state.isOpened });
    if (this.state.isOpened) {
      this.props.onClearConsole();
    }
    const { current } = this.props.debugPage;
    if (current && current.files && current.files[0]) {
      this.props.onRunningCodeChange(current.files[0].content);
    }
  };

  onExecClick = () => {
    this.props.onExecCodeClick();
  };

  onClearClick = () => {
    this.props.onClearConsole();
  };

  handlePageChange = curSec => {
    const { loadSectionDetail } = this.props;
    if (loadSectionDetail) {
      loadSectionDetail(curSec.id);
    }
  };

  render() {
    const { isOpened } = this.state;
    const {
      loading,
      current,
      running,
      runningCode,
      runningResult = [],
      runningEnd = {}
    } = this.props.debugPage;
    const { list = [] } = this.props.section;
    const canFull = !current || !current.files || current.files.length === 0;
    return (
      <View className="debug-page__container">
        {loading && <Loading loading={loading} loadingText="正在加载..." />}
        <View className="pagination">
          <SectionPaging
            current={list.findIndex(s => s.id === current.id)}
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
              onClick={this.toggleOpened.bind(this)}
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
          {current && <RichText nodes={current.files[0].content_hl}></RichText>}
        </View>

        <AtFloatLayout
          isOpened={isOpened}
          title="调试代码"
          onClose={this.toggleOpened.bind(this)}
        >
          <View className="debug-page__layout">
            {running && <Loading loading loadingText="正在加载..." />}
            <Button
              onClick={this.onExecClick.bind(this)}
              className="btn-run exec"
              disabled={running}
              size="mini"
              loading={running}
            >
              <Text className="at-fab__icon at-icon at-icon-play"></Text>
              Go
            </Button>
            <AtTextarea
              maxLength={10000}
              height="500"
              onChange={(e: any) => {
                this.props.onRunningCodeChange(e);
              }}
              value={runningCode}
            ></AtTextarea>
            <View className="running_result">
              <Button
                onClick={this.onClearClick.bind(this)}
                className="btn-run clear"
                disabled={false}
                size="mini"
              >
                <Text
                  className="at-fab__icon at-icon at-icon-close"
                  style={{ transform: "scale(.8)" }}
                ></Text>
                清理
              </Button>
              {runningResult.map((r, idx) => {
                return <View key={`rr_${idx}`} className="running_result--line">{r.Body}</View>;
              })}
              {runningEnd && (
                <View className="running_result--line end">结束</View>
              )}
            </View>
          </View>
        </AtFloatLayout>
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

export default DebugPage as ComponentClass<DebugPageOwnProps, DebugPageState>;
