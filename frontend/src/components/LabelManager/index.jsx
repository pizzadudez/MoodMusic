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
  console.log(labels);
  return (
    <Wrapper>
      {labels.map(id => (
        <LabelCard label={labelsById[id]} />
      ))}
    </Wrapper>
  );
});

const Wrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  overflow: auto;
  max-height: 900px;
  /* display: grid;
  grid-template-columns: repeat(auto-fit, minmax(auto, 120px));
  grid-column-gap: 4px; */
`;
