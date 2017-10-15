let apiKey,
    apiRequestUri

switch (process.env.NODE_ENV) {
  case 'development':
  case 'production':
    apiKey = 'AIzaSyC5OH_u0uhQE2lYjzZjXbHl8jLD89v2Qhk'
    apiRequestUri = 'https://vision.googleapis.com/v1/'
    break;
  default:
    break;
}

export const config = {
  apiRequestUri: apiRequestUri,
  apiKey: apiKey,
}

export default config