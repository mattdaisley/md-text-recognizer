import { createStore, applyMiddleware } from 'redux';

import { rootReducer, initialState } from './Reducers'

import loggingMiddleware     from './LoggingMiddleware';

import googleVisionMiddleware   from './GoogleVision/GoogleVisionMiddleware';

export const ConfigureStore = () => {
  const store = createStore(
    rootReducer,
    initialState,
    applyMiddleware(
      loggingMiddleware,
      googleVisionMiddleware,
    )
  );

  return store;
}


export default ConfigureStore;