import React, { memo, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { createSelector } from 'reselect';
import { NavLink } from 'react-router-dom';
import styled from 'styled-components';

// import { fetchUpdates } from '../actions/dataActions';
// import { updateTrackLabels, updatePlaylistTracks } from '../actions/trackActions';
import Button from './common/Button';

const stateSelector = createSelector(
  state => state.playlists,
  ({ playlistsById, ids }) =>
    ids.some(id => playlistsById[id].changes && playlistsById[id].tracking)
);

export default memo(() => {
  const dispatch = useDispatch();
  const { changes } = useSelector(stateSelector);

  // const submitChanges = useCallback(() => {
  //   dispatch(updateTrackLabels());
  //   dispatch(updatePlaylistTracks());
  // }, [dispatch]);
  // const checkForUpdates = useCallback(() => {
  //   dispatch(fetchUpdates());
  // }, [dispatch]);

  return (
    <Nav>
      <Links>
        <li>
          <NavLink to="/">
            <Button text="Main View" />
          </NavLink>
        </li>
        {/* <li><NavLink to="/playlists"><button>Manage Playlists</button></NavLink></li>
        <li><NavLink to="/labels"><button>Manage Labels</button></NavLink></li> */}
      </Links>
      <Button
        text={'Submit Changes'}
        // onClick={submitChanges}
      />
      <Button
        text={'Check for Updates'}
        highlight={changes}
        // onClick={checkForUpdates}
      />
    </Nav>
  );
});

const Nav = styled.nav`
  height: 50px;
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
