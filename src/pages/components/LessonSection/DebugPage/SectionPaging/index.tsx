/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/sort-comp */
// import { ComponentClass } from "react";
import Taro from "@tarojs/taro";
import { View, Text, Button } from "@tarojs/components";
// import { connect } from "@tarojs/redux";

import "./index.scss";

type IProps = {
  current: any;
  sections: any[];
  onPageChange: (curSec) => void;
};
export default function SectionPaging(props: IProps) {
  const { current = 0, sections = [], onPageChange } = props;
  const hasNext = current < sections.length - 1;
  const hasPrev = current > 0;
  const handlePrevPage = () => {
    if (onPageChange) {
      onPageChange(sections[current - 1]);
    }
  };
  const handleNextPage = () => {
    if (onPageChange) {
      onPageChange(sections[current + 1]);
    }
  };
  return (
    <View className="section-paging__container">
      {sections.length > 0 && (
        <View>
          <View className="section-paging__current">
            {sections[Math.max(current, 0)].title}
          </View>
          <View className="pagination">
            <Button
              onClick={handlePrevPage.bind(this)}
              disabled={!hasPrev}
              className="pagination__item page2first"
            >
              <View className="taro-text at-icon at-icon-chevron-left">
                <Text>
                  {hasPrev ? sections[current - 1].title : sections[current].title}
                </Text>
              </View>
            </Button>
            <Button
              onClick={handleNextPage.bind(this)}
              disabled={!hasNext}
              className="pagination__item page2last"
            >
              <View>
                <Text>
                  {hasNext ? sections[current + 1].title : sections[current].title}
                </Text>
                <Text className="taro-text at-icon at-icon-chevron-right"></Text>
              </View>
            </Button>
          </View>
        </View>
      )}
    </View>
  );
}
