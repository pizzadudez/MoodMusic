import React, {
  memo,
  useRef,
  useEffect,
  useState,
  useCallback,
  useMemo,
} from 'react';
import { createSelector } from 'reselect';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';
import { AutoSizer, List } from 'react-virtualized';
import _ from 'lodash';

import TrackSlide from './TrackSlide';
import TrackToolBar from './TrackToolBar';
import TrackModal from './TrackModal';

const stateSelector = createSelector(
  state => state.tracks.tracksById,
  state => state.filter.ids,
  state => state.tracks.selected,
  (tracksById, tracks, selected) => ({ tracksById, tracks, selected })
);

export default memo(() => {
  // console.log('TrackManager');
  const dispatch = useDispatch();
  const { tracksById, tracks, selected } = useSelector(stateSelector);
  const [widthRestriction, setWidthRestriction] = useState(false);
  const [filter, setFilter] = useState('');
  const sizeRef = useRef(null);

  const filtered = useMemo(
    () =>
      tracks.filter(id => {
        const { name, artist, album } = tracksById[id];
        return [name, artist, album.name].some(field =>
          field.toLowerCase().includes(filter)
        );
      }),
    [filter, tracks]
  );
  const handleWidthChange = useCallback(() => {
    if (sizeRef.current) {
      const width = sizeRef.current.getBoundingClientRect().width;
      width >= 900 ? setWidthRestriction(false) : setWidthRestriction(true);
    }
  }, [setWidthRestriction]);
  const searchFilter = useCallback(
    e => {
      setFilter(e.target.value.toLowerCase());
    },
    [setFilter]
  );
  // Track Modal
  const [openTrack, setOpenTrack] = useState(false);
  const close = useCallback(
    e => {
      setOpenTrack(false);
    },
    [setOpenTrack]
  );

  useEffect(() => {
    if (sizeRef.current) {
      window.addEventListener('resize', _.throttle(handleWidthChange, 500));
    }
  }, [sizeRef.current, handleWidthChange]);

  const rowRenderer = ({ key, index, isScrolling, isVisible, style }) => {
    return (
      <div key={key} style={style}>
        <TrackSlide
          track={tracksById[filtered[index]]}
          checked={selected[filtered[index]] || false}
          widthRestriction={widthRestriction}
          setOpenTrack={setOpenTrack}
        />
      </div>
    );
  };

  return (
    <Wrapper>
      <TrackModal open={openTrack} onClose={close} />
      <TrackToolBar searchFilter={searchFilter} />
      <div ref={sizeRef}>
        <AutoSizer>
          {({ height, width }) => (
            <List
              height={height}
              width={width}
              rowCount={filtered.length}
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
  height: 100%;
  display: grid;
  grid-template-rows: 50px 1fr;
  row-gap: 10px;
`;
