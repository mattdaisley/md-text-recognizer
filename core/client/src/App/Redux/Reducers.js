import { combineReducers } from 'redux';

import * as googleVision   from './GoogleVision/GoogleVision';

export const rootReducer = combineReducers({
  googleVision: googleVision.reducer,
})

export const initialState = {
  googleVision: googleVision.initialState,
}

export default rootReducer