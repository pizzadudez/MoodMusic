import React, { memo, useCallback, useMemo } from 'react';
import styled from 'styled-components';
import { useDispatch } from 'react-redux';
import { CSSTransition } from 'react-transition-group';

import {
  deletePlaylist,
  restorePlaylist,
  syncPlaylist,
  revertChanges,
} from '../../actions/playlistActions';
import Button from '../common/Button';
import EditIcon from '@material-ui/icons/Edit';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import ListIcon from '@material-ui/icons/List';
import UpdateIcon from '@material-ui/icons/Update';
import HistoryIcon from '@material-ui/icons/History';
import RestoreFromTrashIcon from '@material-ui/icons/RestoreFromTrash';
import LibraryMusicIcon from '@material-ui/icons/LibraryMusic';
import ShuffleIcon from '@material-ui/icons/Shuffle';
import QueueMusicIcon from '@material-ui/icons/QueueMusic';

export default memo(({ playlist, isOpen, update }) => {
  const dispatch = useDispatch();

  const deleteHandler = useCallback(
    () => dispatch(deletePlaylist(playlist.id)),
    [dispatch, playlist.id]
  );
  const restoreHandler = useCallback(
    () => dispatch(restorePlaylist(playlist.id)),
    [dispatch, playlist.id]
  );
  const syncHandler = useCallback(() => dispatch(syncPlaylist(playlist.id)), [
    dispatch,
    playlist.id,
  ]);
  const revertHandler = useCallback(
    () => dispatch(revertChanges(playlist.id)),
    [dispatch, playlist.id]
  );

  const buttons = useMemo(() => {
    switch (playlist.type) {
      case 'deleted':
        return (
          <Button
            onClick={restoreHandler}
            variant="special"
            startIcon={<RestoreFromTrashIcon />}
          >
            Restore Playlist
          </Button>
        );
      case 'untracked':
        return (
          <>
            <MenuButtons>
              <Button onClick={update} variant="open" startIcon={<EditIcon />}>
                Modify
              </Button>
              <Button
                onClick={syncHandler}
                disabled={!playlist.updates}
                variant="special"
                startIcon={<LibraryMusicIcon />}
              >
                Import Tracks
              </Button>
            </MenuButtons>
            <Button
              onClick={deleteHandler}
              variant="danger"
              startIcon={<DeleteOutlineIcon />}
              tooltip="Delete playlist."
            />
          </>
        );
      case 'mix':
      case 'label':
        return (
          <>
            <MenuButtons>
              <Button disabled variant="open" startIcon={<QueueMusicIcon />}>
                Tracks
              </Button>
              <Button variant="open" onClick={update} startIcon={<EditIcon />}>
                Modify
              </Button>
              <Button disabled variant="special" startIcon={<ListIcon />}>
                Order by
              </Button>
              {playlist.type === 'label' ? (
                <>
                  <Button
                    onClick={syncHandler}
                    disabled={!playlist.updates}
                    variant="special"
                    startIcon={<UpdateIcon />}
                    tooltip="Sync playlist."
                  />
                  <Button
                    onClick={revertHandler}
                    disabled={!playlist.updates}
                    variant="special"
                    startIcon={<HistoryIcon />}
                    tooltip="Revert playlist changes."
                  />
                </>
              ) : (
                <Button
                  onClick={syncHandler}
                  variant="special"
                  startIcon={<UpdateIcon />}
                  tooltip="Sync playlist."
                />
              )}
            </MenuButtons>
            <Button
              onClick={deleteHandler}
              variant="danger"
              startIcon={<DeleteOutlineIcon />}
              tooltip="Delete playlist."
            />
          </>
        );
      default:
        return undefined;
    }
  }, [
    playlist,
    update,
    deleteHandler,
    restoreHandler,
    syncHandler,
    revertHandler,
  ]);

  return (
    <CSSTransition
      in={isOpen}
      timeout={500}
      classNames="form"
      appear
      unmountOnExit
    >
      <Container>
        <ButtonsWrapper>{buttons}</ButtonsWrapper>
      </Container>
    </CSSTransition>
  );
});

const Container = styled.div`
  display: flex;
  align-items: center;
  overflow: hidden;

  min-width: 0;
  width: 0;
  opacity: 0;
  transition: 0.5s;
  &.form-appear {
    transition: none;
    width: 100%;
    opacity: 1;
  }
  &.form-enter-active,
  &.form-enter-done {
    width: 100%;
    opacity: 1;
  }
  &.form-exit-active,
  &.form-exit-done {
    width: 1%;
    opacity: 0;
  }
`;
const ButtonsWrapper = styled.div`
  min-width: 530px;
  width: 100%;
  display: flex;
  justify-content: space-between;
`;
const MenuButtons = styled.div`
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: auto;
  column-gap: 10px;
`;
