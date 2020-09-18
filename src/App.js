import React, { Component } from 'react';
import './App.css';
import Quiz from './components/quiz/Quiz';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import Result from './components/result/Result';

class App extends Component {
  render() {
    return (
      <React.Fragment>
        <BrowserRouter>
          <Switch>
            <Route path="/quiz" exact component={Quiz}></Route>
            {this.props.submitted.length > 0 && <Route path="/result" exact component={Result}></Route>}
            <Redirect from="/" to="/quiz"></Redirect>
          </Switch>
        </BrowserRouter >
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  return {
      submitted: state.submitted
  }
}

export default connect(mapStateToProps, null)(App);
