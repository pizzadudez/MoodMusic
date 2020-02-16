import React, { memo, useCallback } from 'react';
import styled from 'styled-components';

import { syncPlaylist } from '../../actions/playlistActions';
import Button from '../common/Button';
import PlaylistForm from './PlaylistForm';
import { useDispatch } from 'react-redux';

export default memo(({ playlist, isOpen, setOpen }) => {
  const dispatch = useDispatch();
  const open = useCallback(() => setOpen(playlist.id), [setOpen, playlist.id]);
  const close = useCallback(() => setOpen(null), [setOpen]);
  const sync = useCallback(() => dispatch(syncPlaylist(playlist.id)), [
    playlist.id,
  ]);

  return (
    <Container isOpen={isOpen}>
      {isOpen && <PlaylistForm playlist={playlist} onClose={close} />}
      {!isOpen && (
        <Slide>
          <Temp>{playlist.name}</Temp>
          <Temp>{playlist.description.slice(0, 30)}</Temp>
          <Temp>{playlist.type + ' ' + (playlist.label_id || '')}</Temp>
          <Button onClick={open}>Update</Button>
          <Button onClick={sync}>
            {playlist.type === 'untracked' ? 'Import Tracks' : 'Sync Playlist'}
          </Button>
        </Slide>
      )}
    </Container>
  );
});

const Container = styled.div`
  height: ${props => (props.isOpen ? '170px' : '80px')};
  width: 100%;
  padding: 4px 4px;
  margin: 2px 0;
  background-color: #444;
  transition: height 0.15s ease;
`;
const Slide = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(0px, 1fr));
  justify-content: start;
  align-items: center;
  padding-right: 15px;
  height: 100%;
`;
const Temp = styled.div`
  display: grid;
  align-items: center;
  height: 100%;
`;
