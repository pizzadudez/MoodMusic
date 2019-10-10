import React from 'react';
import { NavLink } from "react-router-dom";
import styled from 'styled-components';

export default () => {
  return (
    <Nav>
      <Links>
        <li><NavLink to="/"><button>Tracks</button></NavLink></li>
        <li><NavLink to="/playlist"><button>Playlist</button></NavLink></li>
        <li><NavLink to="/manage/playlists"><button>Manage</button></NavLink></li>
        <li><NavLink to="/manage/labels"><button>Manage</button></NavLink></li>
      </Links>
    </Nav>
  );
};

const Nav = styled.nav`
  height: 50px;
  width: 100%;
  grid-area: navbar;
`;
const Links = styled.ul`
  display: flex;
  flex-direction: row;
  list-style-type: none;
  li {
    padding: 0 5px;
  }
`;