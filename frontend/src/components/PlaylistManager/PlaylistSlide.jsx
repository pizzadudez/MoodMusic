import React, { memo, useCallback } from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { createSelector } from 'reselect';

import UpdateForm from './UpdateForm';
import PlaylistActions from './PlaylistActions';
import EllipsisTooltip from '../common/EllipsisTooltip';
import Label from '../common/Label';
import LibraryMusicIcon from '@material-ui/icons/LibraryMusic';

const stateSelector = createSelector(
  state => state.labels.labelsById,
  labelsById => ({ labelsById })
);

export default memo(({ playlist, toggleUpdate, isUpdating }) => {
  const { labelsById } = useSelector(stateSelector);

  const toggle = useCallback(() => toggleUpdate(playlist.id), [
    toggleUpdate,
    playlist.id,
  ]);

  return (
    <Container>
      <Info>
        <EllipsisTooltip title={playlist.name}>
          <h2>{playlist.name}</h2>
        </EllipsisTooltip>
        <div>
          {playlist.label_id && (
            <TinyLabel
              color={labelsById[playlist.label_id].color}
              name={labelsById[playlist.label_id].name}
            />
          )}
          <span>
            <LibraryMusicIcon />
            {playlist.track_count}
          </span>
          {/* <span>{playlist.type}</span> */}
        </div>
      </Info>
      <SideEffects>
        <PlaylistActions
          playlist={playlist}
          isOpen={!isUpdating}
          update={toggle}
        />
        <UpdateForm playlist={playlist} isOpen={isUpdating} close={toggle} />
      </SideEffects>
    </Container>
  );
});

const Container = styled.div`
  height: 102px;
  width: calc(100% - 18px);
  display: grid;
  grid-template-columns: minmax(210px, 250px) minmax(530px, 1fr);
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
  padding: 8px 6px 8px 0;
  > h2 {
    margin: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 1.7rem;
  }
  > div {
    display: grid;
    grid-auto-flow: column;
    grid-auto-columns: max-content;
    column-gap: 6px;
    align-items: center;
    color: #b3b3b3;
    span {
      svg {
        margin-bottom: -7px;
        margin-right: 2px;
      }
    }
  }
`;
const TinyLabel = styled(Label)`
  height: 32px;
  min-width: 48px;
  max-width: 66px;
  cursor: default;
  font-size: 0.8rem;
  margin: 1px;
`;
const SideEffects = styled.div`
  display: flex;
  width: 100%;
  overflow: hidden;
`;
