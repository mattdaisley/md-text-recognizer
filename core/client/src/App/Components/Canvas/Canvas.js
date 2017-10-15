import React, { Component } from 'react';

class Canvas extends Component {

  componentDidMount() {
    this.drawImage( this.props.data )
  }
  
  componentWillReceiveProps(nextProps) {
    this.drawImage( nextProps.data )
  }

  drawImage(data) {
    const canvas = this.refs.canvas
    const ctx = canvas.getContext("2d")

    var image = new Image()
    image.onload = function() {
        ctx.drawImage(image, 0, 0)
    }
    image.src = data
  }

  render() {
    return(
      <div>
        <canvas ref="canvas" width={350} height={350} />
      </div>
    )
  }
}

export default Canvas