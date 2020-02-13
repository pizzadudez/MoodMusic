import React, { memo, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { createSelector } from 'reselect';
import { NavLink } from 'react-router-dom';
import styled from 'styled-components';

import { syncData } from '../actions/dataActions';
import { submitChanges } from '../actions/trackActions';
import Button from './common/Button';

const stateSelector = createSelector(
  state => state.playlists,
  ({ playlistsById, ids }) =>
    ids.some(id => playlistsById[id].changes && playlistsById[id].tracking)
);

export default memo(() => {
  const dispatch = useDispatch();
  const { changes } = useSelector(stateSelector);

  const submitChangesHandle = useCallback(() => {
    dispatch(submitChanges());
  }, [dispatch]);
  const syncDataHandle = useCallback(() => {
    dispatch(syncData());
  }, [dispatch]);

  return (
    <Nav>
      <Links>
        <li>
          <NavLink to="/">
            <Button>Tracks</Button>
          </NavLink>
        </li>
        <li>
          <NavLink to="/playlists">
            <Button>Playlists</Button>
          </NavLink>
        </li>
        <li>
          <NavLink to="/labels">
            <Button>Labels</Button>
          </NavLink>
        </li>
      </Links>
      <Button highlight={changes} onClick={submitChangesHandle}>
        Submit Changes
      </Button>
      <Button onClick={syncDataHandle}>Hard Sync</Button>
    </Nav>
  );
});

const Nav = styled.nav`
  background-color: #212121;
  /* height: 100%; */
  width: 100%;
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
  a {
    text-decoration: none;
  }
`;
