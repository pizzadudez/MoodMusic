import React, { memo, useCallback } from 'react';
import styled from 'styled-components';
import { createSelector } from 'reselect';
import { useSelector } from 'react-redux';

import ExpandButton from '../common/ExpandButton';
import Label from '../common/Label';
import LabelForm from './LabelForm';
import Divider from '@material-ui/core/Divider';

const stateSelector = createSelector(
  state => state.playlists.playlistsById,
  state => state.labels.labelsById,
  (playlistsById, labelsById) => ({ playlistsById, labelsById })
);

export default memo(({ label, update, formOpen }) => {
  const { playlistsById, labelsById } = useSelector(stateSelector);
  const toggle = useCallback(() => update(label.id), [update, label.id]);

  return (
    <Paper>
      <Card>
        <Header>
          <h2 style={{ textAlign: 'center', margin: 0 }}>
            {label.verbose || label.name}
          </h2>
          <StyledLabel color={label.color} name={label.name} />
          <ExpandButton onClick={toggle} expanded={formOpen}>
            Update
          </ExpandButton>
        </Header>
        <Details>
          <div>
            <span>type</span>
            <span>{label.type}</span>
          </div>
          <Divider />
          <div>
            <span>#tracks</span>
            <span>{label.track_count}</span>
          </div>
          <Divider />
          {label.playlist_id && (
            <>
              <div>
                <span>playlist</span>
                <span>{playlistsById[label.playlist_id].name}</span>
              </div>
              <Divider />
            </>
          )}
          {label.parent_id && (
            <>
              <div>
                <span>main genre</span>
                <div>
                  <TinyLabel
                    color={labelsById[label.parent_id].color}
                    name={labelsById[label.parent_id].name}
                  />
                </div>
              </div>
              <Divider />
            </>
          )}
          {label.suffix && (
            <>
              <div>
                <span>subgenre suffix</span>
                <div>
                  <TinyLabel color={label.color} name={label.suffix} />
                </div>
              </div>
            </>
          )}
          {label.subgenre_ids && (
            <>
              <div>
                <span>subgenres</span>
                <div>
                  {label.subgenre_ids.map(id => (
                    <TinyLabel
                      key={'subgenres_' + id}
                      color={labelsById[id].color}
                      name={labelsById[id].suffix || labelsById[id].name}
                    />
                  ))}
                </div>
              </div>
              <Divider />
            </>
          )}
          <div>
            <span>created</span>
            <span>...</span>
          </div>
          <Divider />
          <div>
            <span>updated</span>
            <span>...</span>
          </div>
        </Details>
      </Card>
      <LabelForm id={label.id} close={toggle} isOpen={formOpen} />
    </Paper>
  );
});

const Paper = styled.div`
  height: 350px;
  display: inline-flex;
  overflow: hidden;
  background-color: #353535;
  color: white;
  margin: 4px;
  border-radius: 4px;
  box-shadow: 0px 2px 1px -1px rgba(0, 0, 0, 0.2),
    0px 1px 1px 0px rgba(0, 0, 0, 0.14), 0px 1px 3px 0px rgba(0, 0, 0, 0.12);
`;
const Card = styled.div`
  width: 300px;
  display: flex;
  flex-direction: column;
  padding: 6px;
`;
const Header = styled.div`
  display: grid;
  grid-template-columns: 1fr min-content min-content;
  align-items: center;
  margin-bottom: 12px;
`;
const Details = styled.div`
  display: grid;
  grid-auto-flow: row;
  row-gap: 2px;
  /* display: flex;
  flex-direction: column; */
  background: #2b2b2b;
  border-radius: 3px;
  > div {
    min-width: 0; /* fix exceeding parent grid */
    padding: 0 6px;
    display: flex;
    min-height: 30px;
    align-items: center;
    justify-content: space-between;
    > span:first-child {
      color: #cecbcba6;
      margin-right: 6px;
      font-size: 0.9rem;
    }
    > span:last-child {
      display: inline-block;
      text-align: end;
      color: #60ea8e;
      margin: 4px 0;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    > div:last-child {
      display: flex;
      flex-wrap: wrap;
      justify-content: flex-end;
    }
  }
`;

const StyledLabel = styled(Label)`
  cursor: default;
  height: 56px;
  min-width: 90px;
  max-width: 110px;
  font-size: 1.1rem;
  span {
    padding: 0 12px;
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
