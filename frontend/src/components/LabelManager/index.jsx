import React, { memo } from 'react';
import { createSelector } from 'reselect';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import LabelCard from './LabelCard';

const stateSelector = createSelector(
  state => state.labels.labelsById,
  state => state.labels.ids,
  state => state.tracks.tracksById,
  (labelsById, labels, tracksById) => ({ labelsById, labels, tracksById })
);

export default memo(() => {
  const { labelsById, labels, tracksById } = useSelector(stateSelector);

  return (
    <Wrapper>
      <div>Search bar and buttons here</div>
      <LabelContainer>
        {labels.map(id => (
          <LabelCard key={id} label={labelsById[id]} />
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
