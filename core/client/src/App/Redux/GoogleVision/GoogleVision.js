import * as types from '../Types';

// Initial (starting) state
export const initialState = {
  imagesResults: [],
}

// Our root reducer starts with the initial state
// and must return a representation of the next state
export const reducer = (state = initialState, action) => {
  switch(action.type) {
    case types.GOOGLE_VISION_IMAGES_ANNOTATE:
      console.log(action)
      return { ...state, imagesResults: action.payload }
    default:
      return state;
  }
}

export default reducer