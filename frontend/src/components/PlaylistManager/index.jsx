import React, { memo, useCallback, useState } from 'react';
import { createSelector } from 'reselect';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';

import PlaylistSlide from './PlaylistSlide';
import Button from '../common/Button';
import PlaylistForm from './PlaylistForm';

const stateSelector = createSelector(
  state => state.playlists.playlistsById,
  state => state.playlists.ids,
  (playlistsById, playlists) => ({ playlistsById, playlists })
);

export default memo(() => {
  console.log('PlaylistManager');
  const { playlistsById, playlists } = useSelector(stateSelector);
  const [openFormId, setOpenFormId] = useState(null);
  const [createOpen, setCreateOpen] = useState(false);
  const toggleCreateForm = useCallback(() => {
    setCreateOpen(open => !open);
    setOpenFormId(null);
  }, [setCreateOpen]);

  return (
    <Wrapper>
      <div>
        <Button onClick={toggleCreateForm}>New Playlist</Button>
      </div>
      <SlidesContainer>
        <NewPlaylist isOpen={createOpen}>
          {createOpen && <PlaylistForm onClose={toggleCreateForm} />}
        </NewPlaylist>
        {playlists.map(id => (
          <PlaylistSlide
            key={id}
            playlist={playlistsById[id]}
            setOpen={setOpenFormId}
            isOpen={id === openFormId && !createOpen}
          />
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
  display: flex;
  flex-wrap: wrap;
  overflow: auto;
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
