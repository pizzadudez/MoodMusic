import React, { memo, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import { selectAllTracks, deselectAllTracks } from '../../actions/trackActions';

import Button from '../common/Button';

export default memo(({ searchFilter }) => {
  // console.log('TrackToolBox');
  const dispatch = useDispatch();
  const selectAll = useCallback(() => {
    dispatch(selectAllTracks());
  }, [dispatch]);
  const deselectAll = useCallback(() => {
    dispatch(deselectAllTracks());
  }, [dispatch]);

  return (
    <Wrapper>
      <Button onClick={selectAll}>Select All</Button>
      <Button onClick={deselectAll}>Deselect All</Button>
      <input type="text" onChange={searchFilter} />
    </Wrapper>
  );
});

const Wrapper = styled.div`
  margin-bottom: 12px;
`;
