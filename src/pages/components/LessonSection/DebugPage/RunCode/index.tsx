import { Component } from "react";
import { View, Button, Text } from "@tarojs/components";
import { connect } from "react-redux";
import { AtTextarea } from "taro-ui";
import Loading from "../../../../components/Loading";

import {
  toggleRunningCodeChange,
  toggleRunningCodeReset,
  toggleExecCode,
  clearDebugConsole
} from "../../../../../actions/lesson";

type RunCodeStateProps = {
  debugPage?: {
    loading: boolean;
    current: { id: string; title: string; content: string; files: any[] };
    sections: any[];
    runningCode: string;
    runningResult: any;
    runningEnd: any;
    running: boolean;
  };
  section?: {
    list: any[];
  };
};

type RunCodeDispatchProps = {
  clearList: () => any;
  fetchList: (lessonId, isRefresh) => any;
  loadSectionDetail: (id) => any;
  onRunningCodeChange: (code) => any;
  onRunningCodeReset: (code) => any;
  onExecCodeClick: () => any;
  onClearConsole: () => any;
};

type RunCodeOwnProps = {
  runningCode?: string;
};

type RunCodeState = {};

type IProps = RunCodeStateProps & RunCodeOwnProps | any;

interface RunCode {
  props: IProps;
}

@connect(
  state => ({
    debugPage: state.lesson.debugPage
  }),
  dispatch => ({
    onRunningCodeChange(code) {
      dispatch(toggleRunningCodeChange(code));
    },
    onRunningCodeReset(code) {
      dispatch(toggleRunningCodeReset(code));
    },
    onExecCodeClick() {
      dispatch(toggleExecCode(null, null));
    },
    onClearConsole() {
      dispatch(clearDebugConsole());
    }
  })
)
class RunCode extends Component {
  static externalClasses = ["run-code"];
  static options = {
    addGlobalClass: true
  };
  componentDidMount() {
    if (this.props.runningCode) {
      this.props.onRunningCodeReset(this.props.runningCode);
    }
  }

  componentWillPreload() {
    if (this.props.runningCode) {
      this.props.onRunningCodeReset(this.props.runningCode);
    }
  }

  onExecClick = () => {
    this.props.onExecCodeClick();
  };

  onClearClick = () => {
    this.props.onClearConsole();
  };

  render() {
    const {
      running,
      runningCode,
      runningEnd,
      runningResult
    } = this.props.debugPage || {};
    return (
      <View className="run-code">
        {running && <Loading loading loadingText="正在加载..." />}
        <View className="running_code">
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
            autoFocus={false}
            maxLength={10000}
            height={1000}
            onChange={(e: any) => {
              this.props.onRunningCodeChange(e);
            }}
            value={`${runningCode}`}
          ></AtTextarea>
        </View>
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
            return (
              <View key={`rr_${idx}`} className="running_result--line">
                {r.Body}
              </View>
            );
          })}
          {runningEnd && <View className="running_result--line end">结束</View>}
        </View>
      </View>
    );
  }
}

export default RunCode;
