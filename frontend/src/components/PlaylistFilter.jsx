import React, { memo, useCallback } from 'react';
import { createSelector } from 'reselect';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';

import FilterInput from './common/FilterInput';
import { Divider } from '@material-ui/core';
import { showAll, showLiked, filterByPlaylist } from '../actions/filterActions';

const stateSelector = createSelector(
  state => state.playlists,
  state => state.filter,
  (playlists, filter) => ({
    playlistsById: playlists.playlistsById,
    playlists: playlists.ids,
    filtered: filter.playlists,
    filterType: filter.filterType,
  })
);

export default memo(() => {
  const dispatch = useDispatch();
  const { playlistsById, playlists, filtered, filterType } = useSelector(
    stateSelector
  );

  const filter = useCallback(
    e => {
      dispatch(filterByPlaylist(e.target.value));
    },
    [dispatch]
  );
  const filterAll = useCallback(
    e => {
      dispatch(showAll());
    },
    [dispatch]
  );
  const filterLiked = useCallback(
    e => {
      dispatch(showLiked());
    },
    [dispatch]
  );

  return (
    <Wrapper>
      <FilterInput
        key="showAll"
        value="showAll"
        text="All Tracks"
        onChange={filterAll}
        checked={filterType === 'all' ? true : false}
      />
      <FilterInput
        key="showLiked"
        value="showLiked"
        text="Liked Tracks"
        onChange={filterLiked}
        checked={filterType === 'liked' ? true : false}
      />
      <StyledDivider />
      {playlists.map(id => (
        <FilterInput
          key={id}
          value={id}
          text={playlistsById[id].name}
          onChange={filter}
          checked={filtered[id] ? true : false}
        />
      ))}
    </Wrapper>
  );
});

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
`;
const StyledDivider = styled(Divider)`
  margin: 7px 7px;
  background-color: #a2a2a22b;
`;
