import React, { memo, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import { selectAllTracks, deselectAllTracks } from '../../actions/trackActions';

import { submitChanges } from '../../actions/trackActions';
import Button from '../common/Button';
import SearchFilter from '../common/SearchFilter';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import TuneIcon from '@material-ui/icons/Tune';
import BackupIcon from '@material-ui/icons/Backup';

export default memo(({ searchFilter, openLabelModal, openPlaylistModal }) => {
  const dispatch = useDispatch();

  const selectAll = useCallback(() => {
    dispatch(selectAllTracks());
  }, [dispatch]);
  const deselectAll = useCallback(() => {
    dispatch(deselectAllTracks());
  }, [dispatch]);
  const submitChangesHandle = useCallback(() => {
    dispatch(submitChanges());
  }, [dispatch]);

  return (
    <Container>
      <SearchFilter type="text" onChange={searchFilter} label="Search Tracks" />
      <Actions>
        <Button onClick={selectAll} startIcon={<CheckBoxIcon />}>
          All
        </Button>
        <Button onClick={deselectAll} startIcon={<CheckBoxOutlineBlankIcon />}>
          All
        </Button>
        <Button onClick={openLabelModal} startIcon={<TuneIcon />}>
          Labels
        </Button>
        <Button onClick={openPlaylistModal} startIcon={<TuneIcon />}>
          Playlists
        </Button>
        <Button
          variant="special"
          onClick={submitChangesHandle}
          startIcon={<BackupIcon />}
        >
          Submit Changes
        </Button>
      </Actions>
    </Container>
  );
});

const Container = styled.div`
  display: grid;
  grid-template-columns: 250px min-content;
  align-items: center;
  column-gap: 6px;
`;
const Actions = styled.div`
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: min-content;
  column-gap: 6px;
`;
