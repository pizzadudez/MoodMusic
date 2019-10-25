import React, { Component } from 'react';
import { connect } from 'react-redux';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import { fetchData } from './actions/dataActions';
import Page from './components/Page';
import FormLabelCreate from './components/FormLabelCreate';
import TracksContainer from './components/TracksContainer';
import LabelView from './components/LabelView';
import PlaylistView from './components/PlaylistView';
import LabelFilterView from './components/LabelFilterView';
import PlaylistManager from './components/PlaylistManager';
import FormPlaylistCreate from './components/FormPlaylistCreate';
import Button from './components/Button';

class App extends Component {
  constructor(props) {
    super(props);
    this.props.fetchData();
  }
  render() {
    if (!this.props.authorized) return (
      <a href="http://localhost:8888/auth">
        <Button 
          text={'Authorize'}
          onClick={() => console.log('authTest')}
        />
      </a>
    );
    return (
      <Router>
        <Switch>
          <Route path="/labels">
            <Page
              Sidebar={<LabelView />}
              Content={<TracksContainer />}
            />
          </Route>
          <Route path="/manage/playlists">
            <Page
              Sidebar={<FormPlaylistCreate />}
              Content={<PlaylistManager />}
            />    
          </Route>
          <Route path="/manage/labels">
            <Page
              Sidebar={<FormLabelCreate />}
              Content={<TracksContainer />}
            />    
          </Route>
          <Route path="/">
            <Page 
              Sidebar={<div><PlaylistView /> <LabelFilterView /> </div>}
              Content={<TracksContainer />}
            />
          </Route>
        </Switch>
      </Router>
    );
  }
};

const mapStateToProps = state => ({ authorized: state.app.authorized })

export default connect(mapStateToProps, { fetchData })(App);