import React, { Component } from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux'

import blue   from 'material-ui/colors/blue'
import { MuiThemeProvider, createMuiTheme, withStyles } from 'material-ui/styles'

import Home from './Components/Home/Home'

import './App.css';

const styles = theme => ({
  
})

class App extends Component {
  render() {
    
    const theme = createMuiTheme({
      palette: {
        primary: {
          ...blue,
          A400: '#00e677',
        }
      },
    })

    return (
      <MuiThemeProvider theme={theme}>
        <Router>
          <Switch>
            <Route exact path='/' component={Home}/>
            <Redirect from='/' to='/'/>
          </Switch>
        </Router>
      </MuiThemeProvider>
    );
  }
}


const mapStateToProps = state => { return { } }
const mapDispatchToProps = dispatch => ({ })

const AppWithStyles = withStyles(styles)(App)
export default connect(mapStateToProps, mapDispatchToProps)(AppWithStyles)
