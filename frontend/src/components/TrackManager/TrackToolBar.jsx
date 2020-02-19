import React, { memo, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import { selectAllTracks, deselectAllTracks } from '../../actions/trackActions';

import { submitChanges } from '../../actions/trackActions';
import Button from '../common/Button';
import TextField from '@material-ui/core/TextField';

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
    <Wrapper>
      <StyledTextField
        type="text"
        onChange={searchFilter}
        label="Search Tracks"
      />
      <Button onClick={selectAll}>Select All</Button>
      <Button onClick={deselectAll}>Deselect All</Button>
      <Button onClick={openLabelModal}>Modify Labels</Button>
      <Button onClick={openPlaylistModal}>Modify Playlists</Button>
      <Button onClick={submitChangesHandle}>Submit Changes</Button>
    </Wrapper>
  );
});

const Wrapper = styled.div``;
const StyledTextField = styled(TextField)`
  label {
    color: grey;
    &.MuiInputLabel-shrink {
      color: white;
    }
  }
  .MuiOutlinedInput-root {
    fieldset {
      border-color: grey;
    }
    &:hover fieldset {
      border-color: lightgray;
    }
    &.Mui-focused fieldset {
      border-color: lightgray;
    }
  }
  input {
    color: white;
  }
`;
