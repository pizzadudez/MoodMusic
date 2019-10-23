import React from 'react';
import { NavLink } from "react-router-dom";
import styled from 'styled-components';

export default () => {
  return (
    <Nav>
      <Links>
        <li><NavLink to="/"><button>Filter</button></NavLink></li>
        <li><NavLink to="/labels"><button>Labels</button></NavLink></li>
        <li><NavLink to="/manage/playlists"><button>Manage Playlists</button></NavLink></li>
        <li><NavLink to="/manage/labels"><button>Manage Labels</button></NavLink></li>
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