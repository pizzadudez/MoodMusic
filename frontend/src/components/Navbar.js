import React, { Component } from 'react';
import { connect } from 'react-redux';
import { NavLink } from "react-router-dom";
import styled from 'styled-components';

import { fetchUpdates } from '../actions/dataActions';
import Button from './Button';

class Navbar extends Component {
  render() {
    return (
      <Nav>
        <Links>
          <li><NavLink to="/"><button>Filter</button></NavLink></li>
          <li><NavLink to="/labels"><button>Labels</button></NavLink></li>
          <li><NavLink to="/manage/playlists"><button>Manage Playlists</button></NavLink></li>
          <li><NavLink to="/manage/labels"><button>Manage Labels</button></NavLink></li>
        </Links>
        <Button 
          text={'Check for Updates'}
          highlight={this.props.changes}
          onClick={() => this.props.fetchUpdates()}
        />
      </Nav>
    );
  }
}

const mapStateToProps = state => ({
  changes: state.playlists.all.some(id => {
    const { mood_playlist, changes, tracking } = state.playlists.map[id];
    return !mood_playlist && changes && tracking
  }),
});

export default connect(mapStateToProps, { fetchUpdates })(Navbar);

const Nav = styled.nav`
  height: 50px;
  width: 100%;
  grid-area: navbar;
  display: flex;
  align-items: center;
`;
const Links = styled.ul`
  display: flex;
  flex-direction: row;
  list-style-type: none;
  li {
    padding: 0 5px;
  }
`;