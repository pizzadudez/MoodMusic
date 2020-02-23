import React, { memo, useCallback } from 'react';
import { createSelector } from 'reselect';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';

import LabelCard from './LabelCard';
import { selectLabelToUpdate } from '../../actions/labelActions';

const stateSelector = createSelector(
  state => state.labels.labelsById,
  state => state.labels.ids,
  state => state.tracks.tracksById,
  (labelsById, labels, tracksById) => ({ labelsById, labels, tracksById })
);

export default memo(() => {
  console.log('LabelManager');
  const dispatch = useDispatch();
  const { labelsById, labels, tracksById } = useSelector(stateSelector);

  const updateLabel = useCallback(
    id => e => {
      dispatch(selectLabelToUpdate(id));
    },
    [dispatch]
  );

  return (
    <Wrapper>
      <div>Search bar and buttons here</div>
      <LabelContainer>
        {labels.map(id => (
          <LabelCard key={id} label={labelsById[id]} update={updateLabel} />
        ))}
      </LabelContainer>
    </Wrapper>
  );
});

const Wrapper = styled.div`
  max-height: 100%;
  display: grid;
  grid-template-rows: 50px calc(100% - 56px);
  grid-row-gap: 6px;
`;
const LabelContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  overflow: auto;
`;
