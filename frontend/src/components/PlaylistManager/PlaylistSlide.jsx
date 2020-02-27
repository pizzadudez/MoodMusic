import React, { memo, useCallback } from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { createSelector } from 'reselect';

import UpdateForm from './UpdateForm';
import PlaylistActions from './PlaylistActions';
import Label from '../common/Label';

const stateSelector = createSelector(
  state => state.labels.labelsById,
  labelsById => ({ labelsById })
);

export default memo(({ playlist, toggleUpdate, isUpdating }) => {
  const { labelsById } = useSelector(stateSelector);

  const toggle = useCallback(() => toggleUpdate(playlist.id), [playlist.id]);

  return (
    <Container>
      <Info>
        <h2>{playlist.name}</h2>
        <div>
          <span>{playlist.type}</span>
          {playlist.label_id && (
            <TinyLabel
              color={labelsById[playlist.label_id].color}
              name={labelsById[playlist.label_id].name}
            />
          )}
          <span>{playlist.track_count}</span>
        </div>
      </Info>
      <SideEffects>
        <PlaylistActions isOpen={!isUpdating} update={toggle} />
        <UpdateForm playlist={playlist} isOpen={isUpdating} close={toggle} />
      </SideEffects>
    </Container>
  );
});

const Container = styled.div`
  height: 102px;
  width: calc(100% - 18px);
  display: grid;
  grid-template-columns: 210px 1fr;
  padding: 6px;
  background-color: #353535;
  color: white;
  border-radius: 4px;
  box-shadow: 0px 2px 1px -1px rgba(0, 0, 0, 0.2),
    0px 1px 1px 0px rgba(0, 0, 0, 0.14), 0px 1px 3px 0px rgba(0, 0, 0, 0.12);
`;
const Info = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 8px 0;
  > h2 {
    margin: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 1.7rem;
  }
  > div {
    display: inline-grid;
    grid-template-columns: repeat(3, min-content);
    column-gap: 5px;
    align-items: center;
  }
`;
const SideEffects = styled.div`
  display: flex;
  width: 100%;
  overflow: hidden;
`;

const TinyLabel = styled(Label)`
  height: 32px;
  min-width: 48px;
  max-width: 66px;
  cursor: default;
  font-size: 0.8rem;
  margin: 1px;
`;
