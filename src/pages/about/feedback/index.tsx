/* eslint-disable no-unused-vars */
import { Component } from "react";
import Taro from "@tarojs/taro";
import { View, Label } from "@tarojs/components";
import { AtTextarea, AtButton } from "taro-ui";
import { connect } from "react-redux";

import { submitFeedback, toggleContentChange } from "../../../actions/feedback";
import "./index.scss";

type FeedbackStateProps = {
  feedback: any;
};

type FeedbackDispatchProps = {
  onSubmitFeedback: (cb: Function) => void;
  toggleContentChange: (content: string) => void;
};

type FeedbackOwnProps = {};

type FeedbackState = {};

type IProps = FeedbackStateProps & FeedbackDispatchProps & FeedbackOwnProps;

interface Feedback {
  props: IProps;
}

@connect(
  ({ feedback }) => ({
    feedback
  }),
  dispatch => ({
    onSubmitFeedback(cb) {
      dispatch(submitFeedback(cb));
    },
    toggleContentChange(content) {
      dispatch(toggleContentChange(content));
    }
  })
)
class Feedback extends Component {
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
      url: "/pages/example-list/index"
    });
  };

  render() {
    const { content } = this.props.feedback;
    return (
      <View className="index">
        <View>
          <Label>反馈信息</Label>
          <AtTextarea
            value={content}
            className="cot"
            onChange={this.props.toggleContentChange.bind(this)}
            maxLength={200}
            placeholder="写下你的反馈意见，能帮助我们更好的改进，非常感谢！"
          ></AtTextarea>
          <AtButton
            className="btn-sub"
            type="primary"
            onClick={() => {
              if (!content || content.length < 3) {
                Taro.showToast({ title: "内容太少啦!", icon: "none" });
              } else {
                this.props.onSubmitFeedback((err) => {
                  if (err) {
                    return Taro.showToast({ title: "提交失败" + err.statusCode, icon: "none" });
                  }
                  Taro.showToast({ title: "感谢你的反馈" });
                });
              }
            }}
          >
            提交
          </AtButton>
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

export default Feedback;
