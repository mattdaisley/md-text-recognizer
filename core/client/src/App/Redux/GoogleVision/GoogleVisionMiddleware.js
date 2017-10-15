import * as types from '../Types';

import { doApiRequest } from './GoogleVisionRequest';

const googleVisionMiddleware = store => next => action => {
  if (!action.meta || action.meta.type !== 'googleVision') {
    return next(action);
  }

  const { url } = action.meta;

  switch (action.type) {
    case types.GOOGLE_VISION_IMAGES_ANNOTATE:

      const options = {
        method: 'POST',
        body: JSON.stringify(action.meta.body)
      }
      
      doApiRequest(store, url, options)
        .then(responses => {
          let newAction = Object.assign({}, action, { payload: responses });
          delete newAction.meta;
          store.dispatch(newAction);
        })
        .catch( error => console.log('error:',error) )
        // .catch( error => {} )
        
      break

    default:
      break
  }

}

export default googleVisionMiddleware