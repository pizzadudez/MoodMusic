import React, { memo } from 'react';
import { createSelector } from 'reselect';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';
import { AutoSizer, List } from 'react-virtualized';

import TrackSlide from './TrackSlide';
import TrackToolBar from './TrackToolBar';

const stateSelector = createSelector(
  state => state.tracks.tracksById,
  state => state.tracks.ids,
  state => state.tracks.selected,
  (tracksById, tracks, selected) => ({ tracksById, tracks, selected })
);

export default memo(() => {
  console.log('TrackManager');
  const dispatch = useDispatch();
  const { tracksById, tracks, selected } = useSelector(stateSelector);

  const rowRenderer = ({ key, index, isScrolling, isVisible, style }) => {
    return (
      <div key={key} style={style}>
        <TrackSlide
          track={tracksById[tracks[index]]}
          checked={selected[tracks[index]] || false}
        />
      </div>
    );
  };
  return (
    <Wrapper>
      <TrackToolBar />
      <div>
        <AutoSizer>
          {({ height, width }) => (
            <List
              height={height}
              width={width}
              rowCount={tracks.length}
              rowHeight={58}
              rowRenderer={rowRenderer}
            />
          )}
        </AutoSizer>
      </div>
    </Wrapper>
  );
});

const TrackList = styled.div`
  overflow-y: scroll;
  overflow-x: hidden;
  padding-right: 18px;
`;

const Wrapper = styled.div`
  display: grid;
  grid-template-rows: auto 844px;
`;
