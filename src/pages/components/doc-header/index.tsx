import Taro, { ComponentClass, Component } from "@tarojs/taro";
import { View } from "@tarojs/components";
import { connect } from "@tarojs/redux";
import { AtSwitch } from "taro-ui";

import "./index.scss";

type PageStateProps = {};

type PageDispatchProps = {};
type PageOwnProps = {
  title: string;
  desc: string;
  options?: {
    [key: string]: any;
  }[];
};

type PageState = {};

type IProps = PageStateProps & PageDispatchProps & PageOwnProps;

interface DocsHeader {
  props: IProps;
}

@connect(({ title, desc }) => ({
  title,
  desc
}))
class DocsHeader extends Component {
  render() {
    const { title, desc, options } = this.props;
    return (
      <View className="doc-header">
        <View className="doc-header__title">{title}</View>
        <View className="doc-header__desc">{desc}</View>
        {options && (
          <AtSwitch

            title={options[0].title}
            color="#7abfde"
            checked={options[0].checked}
            onChange={options[0].onChange.bind(this)}
          />
        )}
      </View>
    );
  }
}

export default DocsHeader as ComponentClass<PageOwnProps, PageState>;
