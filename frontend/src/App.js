import React, { Component } from 'react';
import { connect } from 'react-redux';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import { fetchData } from './actions/actions';
import Page from './components/Page';
import FormLabelCreate from './components/FormLabelCreate';
import TracksContainer from './components/TracksContainer';
import LabelView from './components/LabelView';

class App extends Component {
  constructor(props) {
    super(props);
    this.props.fetchData();
  }
  render() {
    return (
      <Router>
        <Switch>
          <Route path="/playlist">
            <Page
              Sidebar={<FormLabelCreate />}
              Content={<TracksContainer />}
            />    
          </Route>
          <Route path="/">
            <Page 
              Sidebar={<LabelView />}
              Content={<TracksContainer />}
            />
          </Route>
        </Switch>
      </Router>
    );
  }
};

export default connect(null, { fetchData })(App);