import React, { memo, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { createSelector } from 'reselect';
import { NavLink } from 'react-router-dom';
import styled from 'styled-components';

import { syncData } from '../actions/dataActions';
import Button from './common/Button';

export default memo(() => {
  const dispatch = useDispatch();

  const syncDataHandle = useCallback(() => {
    dispatch(syncData());
  }, [dispatch]);

  return (
    <Nav>
      <Menu>
        <NavLink to="/">
          <Button>Tracks</Button>
        </NavLink>
        <NavLink to="/playlists">
          <Button>Playlists</Button>
        </NavLink>
        <NavLink to="/labels">
          <Button>Labels</Button>
        </NavLink>
      </Menu>
      <Actions>
        <Button onClick={syncDataHandle}>Hard Sync</Button>
        <Button disabled>New Features</Button>
      </Actions>
    </Nav>
  );
});

const Nav = styled.nav`
  width: 100%;
  display: flex;
  align-items: center;
  background-color: #212121;
`;
const Menu = styled.div`
  display: grid;
  grid-auto-flow: column;
  column-gap: 6px;
  padding: 0 12px;
  a {
    text-decoration: none;
  }
`;
const Actions = styled.div`
  display: grid;
  grid-auto-flow: column;
  column-gap: 6px;
  padding: 0 12px;
`;
