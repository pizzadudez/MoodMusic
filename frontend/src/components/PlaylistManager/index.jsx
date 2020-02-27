import React, { memo, useCallback, useState } from 'react';
import { createSelector } from 'reselect';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';

import PlaylistSlide from './PlaylistSlide';
import Button from '../common/Button';

const stateSelector = createSelector(
  state => state.playlists.playlistsById,
  state => state.playlists.ids,
  playlistsById => ({
    playlistsById,
    playlistIdsByType: Object.values(playlistsById).reduce(
      (obj, pl) => ({
        ...obj,
        [pl.type]: [...(obj[pl.type] || []), pl.id],
      }),
      {}
    ),
  })
);

export default memo(() => {
  console.log('PlaylistManager');
  const { playlistsById, playlistIdsByType } = useSelector(stateSelector);

  const [updateForm, setUpdateForm] = useState(null);
  const toggleUpdate = useCallback(
    id => setUpdateForm(prev => (prev === id ? false : id)),
    []
  );

  return (
    <Wrapper>
      <div>
        <Button>New Playlist</Button>
      </div>
      <SlidesContainer>
        {['label', 'mix', 'untracked', 'deleted'].map(type => (
          <React.Fragment key={type}>
            <h2>{type + ' playlists'}</h2>
            {playlistIdsByType[type].map(id => (
              <PlaylistSlide
                key={id}
                playlist={playlistsById[id]}
                toggleUpdate={toggleUpdate}
                isUpdating={id === updateForm}
              />
            ))}
          </React.Fragment>
        ))}
      </SlidesContainer>
    </Wrapper>
  );
});

const Wrapper = styled.div`
  max-height: 100%;
  display: grid;
  grid-template-rows: 50px calc(100% - 56px);
  grid-row-gap: 6px;
`;
const SlidesContainer = styled.div`
  display: grid;
  grid-auto-flow: row;
  row-gap: 6px;
  overflow-y: auto;
  overflow-x: hidden;
  > h2 {
    color: #c1c1c152;
  }
`;
const NewPlaylist = styled.div`
  height: 0px;
  ${props =>
    props.isOpen
      ? `height: 200px;
         padding: 4px 4px;
         margin: 2px 0;`
      : ''};
  width: 100%;
  background-color: #444;
  transition: height 0.15s ease;
`;
