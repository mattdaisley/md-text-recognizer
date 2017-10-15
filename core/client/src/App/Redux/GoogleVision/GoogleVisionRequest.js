export const doApiRequest = (store, url, options = {}) => {

  return new Promise( (resolve,reject) => {
    // console.log('fetching', url, options)
    fetch(url, options)
      .then(resp => resp.json() )
      .then(json => {
        console.log(json)
        if ( !json.error ) {
          resolve(json.responses)
        } else {
          reject(json.error)
        }
      })
      .catch(err => { 
        console.log('error:',err); 
        reject(err) }  
      )
        
  }) 
}