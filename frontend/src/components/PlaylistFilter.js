import React, { memo, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { createSelector } from 'reselect';
import styled from 'styled-components';

import {
  filterByPlaylist,
  showAll,
  showLiked,
} from '../actions/filterActions';
import PlaylistFilterButton from './PlaylistFilterButton';

const stateSelector = createSelector(
  state => state.playlists,
  state => state.filter,
  (playlists, filter) => ({
    playlistsById: playlists.playlistsById,
    playlists: playlists.ids,
    filtered: filter.playlists,
    filterType: filter.filterType
  })
);

export default memo(() => {
  const dispatch = useDispatch();
  const { playlistsById, playlists, filtered, filterType } = useSelector(stateSelector);

  const filter = useCallback(e => {
    dispatch(filterByPlaylist(e.target.value));
  }, [dispatch]);
  const filterAll = useCallback(e => {
    dispatch(showAll());
  }, [dispatch]);
  const filterLiked = useCallback(e => {
    console.log('liked')
    dispatch(showLiked());
  }, [dispatch]);

  return (
    <Container>
      <PlaylistFilterButton
        key={'showAll'}
        onChange={filterAll}
        text='All Songs'
        checked={filterType === 'all' ? true : false}
        playlist={null}
      />
      <PlaylistFilterButton
        key={'showLiked'}
        onChange={filterLiked}
        text='Liked Songs'
        checked={filterType === 'liked' ? true : false}
        playlist={null}
      />
      <p>Filter by playlist</p>
      {playlists.map(id => (
        <PlaylistFilterButton
          key={id}
          playlist={playlistsById[id]}
          onChange={filter}
          checked={filtered[id] ? true : false}
        />
      ))}
    </Container>
  );
});

const Container = styled.div`
  height: 300px;
  background-color: #292929;
  color: #bdbdbd;
`;