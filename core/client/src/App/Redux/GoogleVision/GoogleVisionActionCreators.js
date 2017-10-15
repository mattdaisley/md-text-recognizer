import * as types from '../Types';

import config from './GoogleVisionConfig';



export const googleVisionImagesAnnotate = ( body ) => {
  
  const requestEnpoint = 'images:annotate'

  return ({
    type: types.GOOGLE_VISION_IMAGES_ANNOTATE,
    meta: {
      type: 'googleVision',
      url: config.apiRequestUri + requestEnpoint + '?key=' + config.apiKey,
      body: body
    }
  })

}