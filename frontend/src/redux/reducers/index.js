import { CHANGE_LANGUAGE } from "../constants/action-types.js";

const initialState = {
    language: "en"
};

function rootReducer(state = initialState, action) {
  if (action.type === CHANGE_LANGUAGE) {
    return Object.assign({}, state, {
      articles: state.language.concat(action.payload)
    });
  }
  return state;
};

export default rootReducer;