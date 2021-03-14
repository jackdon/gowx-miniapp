import { Component } from "react";
import { View } from "@tarojs/components";

import "./index.scss";

type LoadingStateProps = {};

type LoadingDispatchProps = {};
type LoadingOwnProps = {
  loading: boolean;
  loadingText: "正在加载...";
};

type LoadingState = {};

type IProps = LoadingStateProps & LoadingDispatchProps & LoadingOwnProps;

interface Loading {
  props: IProps;
}

class Loading extends Component {
  render() {
    return (
      <View className="at_loading">
        <View className="at_loading__dots"></View>
        <View className="at_loading__dots"></View>
        <View className="at_loading__dots"></View>
      </View>
    );
  }
}

export default Loading;
