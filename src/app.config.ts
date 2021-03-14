import { AppConfig } from '@tarojs/taro';

export default {
  pages: [
    "pages/index/index",
    "pages/example-list/index",
    "pages/example-detail/index",
    "pages/about/index",
    "pages/about/feedback/index",
    "pages/lesson/index",
    "pages/lesson/gallery/index",
    "pages/components/LessonSection/DebugPage/index",
    "pages/lesson/debug/index",
  ],
  window: {
    backgroundTextStyle: "light",
    navigationBarBackgroundColor: "#7abfde",
    navigationBarTitleText: "WeChat",
    navigationBarTextStyle: "black"
  },
  networkTimeout: {
    request: 10000,
    downloadFile: 10000
  }
} as AppConfig;
