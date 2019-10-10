import React, { Component } from 'react';
import { connect } from 'react-redux';
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

import { fetchData } from './actions/actions'; 
import TracksContainer from './components/TracksContainer';
import LabelCreation from './components/LabelCreation';

function Home() {
  return <h2>Home</h2>;
}

function About() {
  return <h2>About</h2>;
}

function Users() {
  return <h2>Users</h2>;
}

const Nav = props => {
  return (
    <nav>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/about">About</Link>
        </li>
        <li>
          <Link to="/users">Users</Link>
        </li>
      </ul>
    </nav>
  );
};

class App extends Component {
  constructor(props) {
    super(props);
    this.props.fetchData();
  }
  render() {
    return (
      <Router>
        <>
          <Nav />
          <Switch>
            <Route path="/about">
              <About />
            </Route>
            <Route path="/users">
              <Users />
            </Route>
            <Route path="/">
              <Home />
            </Route>
          </Switch>
          <LabelCreation />
        </>
      </Router>
    );
  }
};

export default connect(null, { fetchData })(App);