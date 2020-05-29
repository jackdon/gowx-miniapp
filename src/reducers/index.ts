import { combineReducers } from "redux";
import counter from "./counter";
import pageIndex from "./page-index";
import exampleDetail from "./detail";
import feedback from "./feedback";
import { sandbox, gallery, section, debugPage } from './lesson';

export default combineReducers({
  counter,
  pageIndex,
  exampleDetail,
  feedback,
  lesson: combineReducers({
    gallery,
    sandbox,
    section,
    debugPage
  })
});
