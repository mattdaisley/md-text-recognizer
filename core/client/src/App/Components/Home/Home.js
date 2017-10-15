import React, { Component } from 'react';
import { connect } from 'react-redux'
import Webcam from 'react-webcam';

import { withStyles } from 'material-ui/styles'

import Grid   from 'material-ui/Grid';
import Button from 'material-ui/Button';
import List, { ListItem, ListItemText } from 'material-ui/List';

import { googleVisionImagesAnnotate } from '../../Redux/GoogleVision/GoogleVisionActionCreators'

import Canvas from '../Canvas/Canvas'

// import label from '../../../label.jpg';

const styles = theme => ({ })

class Home extends Component {

  constructor(props) {
    super(props)

    this.state = {
      data: ''
    }
  }

  componentDidMount() {
    // this.toDataURL(
    //   label,
    //   (dataUrl) => {
    //     // console.log(dataUrl)
    //     const body = {
    //       "requests": [
    //         {
    //           "image": {
    //             "content": dataUrl.slice(22)
    //           },
    //           "features": [
    //             {
    //               "type": "TEXT_DETECTION"
    //             }
    //           ]
    //         }
    //       ]
    //     }
    
    //     this.props.googleVisionImagesAnnotate(body)
    //   }
    // )
  }

  toDataURL(src, callback, outputFormat) {
    var img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = () => {
      var canvas = document.createElement('CANVAS');
      var ctx = canvas.getContext('2d');
      var dataURL;
      canvas.height = img.naturalHeight / 5;
      canvas.width = img.naturalWidth / 5;
      console.log(img.naturalWidth, img.naturalHeight)
      ctx.drawImage(img, 0, 0);
      ctx.drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight, 0, 0, canvas.width, canvas.height);
      dataURL = canvas.toDataURL(outputFormat);
      callback(dataURL);
    };
    img.src = src;
    if (img.complete || img.complete === undefined) {
      img.src = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";
      img.src = src;
    }
  }
  
  setRef = (webcam) => {
    this.webcam = webcam;
  }
  
  capture = () => {
    const imageSrc = this.webcam.getScreenshot();
    this.setState({data: imageSrc})

    const body = {
      "requests": [
        {
          "image": {
            "content": imageSrc.slice(23)
          },
          "features": [
            {
              "type": "TEXT_DETECTION"
            }
          ]
        }
      ]
    }

    this.props.googleVisionImagesAnnotate(body)
  }
  
  handleImageChange = (event) => {
    event.preventDefault();
    
    let reader = new FileReader();
    let file = event.target.files[0];

    reader.onloadend = () => {
      // console.log(reader.result)
      // this.setState({
      //   file: file,
      //   imagePreviewUrl: reader.result
      // });

      this.toDataURL(
        reader.result,
        (dataUrl) => {
          // console.log(dataUrl)
          this.setState({data: dataUrl})
          const body = {
            "requests": [
              {
                "image": {
                  "content": dataUrl.slice(22)
                },
                "features": [
                  {
                    "type": "TEXT_DETECTION"
                  }
                ]
              }
            ]
          }
      
          this.props.googleVisionImagesAnnotate(body)
        }
      )
    }

    reader.readAsDataURL(file)
  }

  render() {

    const {googleVisionImagesResults} = this.props;
    
    let textElements = [];
    
    if ( googleVisionImagesResults.length > 0 ) {
      console.log(googleVisionImagesResults, typeof googleVisionImagesResults)
      googleVisionImagesResults.forEach( result => {
        if ( Object.keys(result).length > 0 ) {
          textElements.push(
            result.textAnnotations.map( (text, index) => (
              <ListItem key={index}>
                <ListItemText primary={text.description} />
              </ListItem>
            ))
          ) 
        }
      })  
    }

    return (
      <div className="App">

        <Grid container spacing={0} justify="center">
          <Grid item xs={12}>
            {/* <Webcam
              audio={false}
              height={350}
              ref={this.setRef}
              screenshotFormat="image/jpeg"
              width={350}
            /> */}
            <input id="file" type="file" accept="image/*" onChange={(e)=>this.handleImageChange(e)} />
          </Grid>

          {/* <Grid item xs={12}>
            <Button color="primary" onClick={this.capture}>Capture photo</Button>
          </Grid> */}
        </Grid>

        <Grid container spacing={0} justify="center">
          <Grid item xs={12}>
            { (this.state.data.length > 0) && (
              <Canvas data={this.state.data} />
            )}
          </Grid>
            
          <Grid item xs={12}>
            <List>
              {textElements}
            </List>
          </Grid>
        </Grid>

      </div>
    );
  }
}

const mapStateToProps = state => { return { 
  googleVisionImagesResults: state.googleVision.imagesResults
}}

const mapDispatchToProps = dispatch => ({ 
  googleVisionImagesAnnotate: (body) => dispatch(googleVisionImagesAnnotate(body)) 
})

const HomeWithStyles = withStyles(styles)(Home)
export default connect(mapStateToProps, mapDispatchToProps)(HomeWithStyles)
