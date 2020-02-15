import React, { memo, useCallback } from 'react';
import styled from 'styled-components';

import Button from '../common/Button';
import PlaylistForm from './PlaylistForm';

export default memo(({ playlist, isOpen, setOpen }) => {
  const open = useCallback(() => setOpen(playlist.id), [setOpen, playlist.id]);
  const close = useCallback(() => setOpen(null), [setOpen]);

  return (
    <Container isOpen={isOpen}>
      {isOpen && <PlaylistForm playlist={playlist} onClose={close} />}
      {!isOpen && (
        <Slide>
          <Temp>{playlist.name}</Temp>
          <Temp>{playlist.name}</Temp>
          <Temp>{playlist.type}</Temp>
          <Button onClick={open}>Update</Button>
          <Button>Sync/Import</Button>
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
