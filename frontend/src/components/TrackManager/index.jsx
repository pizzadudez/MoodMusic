import React, { memo, useRef, useEffect, useState, useCallback } from 'react';
import { createSelector } from 'reselect';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';
import { AutoSizer, List } from 'react-virtualized';
import _ from 'lodash';

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

  const [widthRestriction, setWidthRestriction] = useState(false);
  const sizeRef = useRef(null);
  const handleWidthChange = useCallback(() => {
    if (sizeRef.current) {
      const width = sizeRef.current.getBoundingClientRect().width;
      width >= 900 ? setWidthRestriction(false) : setWidthRestriction(true);
    }
  }, [setWidthRestriction]);

  useEffect(() => {
    if (sizeRef.current) {
      window.addEventListener('resize', _.throttle(handleWidthChange, 500));
    }
  }, [sizeRef.current, handleWidthChange]);

  const rowRenderer = ({ key, index, isScrolling, isVisible, style }) => {
    return (
      <div key={key} style={style}>
        <TrackSlide
          track={tracksById[tracks[index]]}
          checked={selected[tracks[index]] || false}
          widthRestriction={widthRestriction}
        />
      </div>
    );
  };

  return (
    <Wrapper>
      <TrackToolBar />
      <div ref={sizeRef}>
        <AutoSizer>
          {({ height, width }) => (
            <List
              height={height}
              width={width}
              rowCount={tracks.length}
              rowHeight={48}
              rowRenderer={rowRenderer}
            />
          )}
        </AutoSizer>
      </div>
    </Wrapper>
  );
});

const Wrapper = styled.div`
  display: grid;
  grid-template-rows: auto 844px;
`;
