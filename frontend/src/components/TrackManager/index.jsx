import React, {
  memo,
  useRef,
  useEffect,
  useState,
  useCallback,
  useMemo,
} from 'react';
import { createSelector } from 'reselect';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { AutoSizer, List } from 'react-virtualized';
import _ from 'lodash';

import TrackSlide from './TrackSlide';
import TrackToolBar from './TrackToolBar';
import TrackModal from './TrackModal';
import LabelModal from './LabelModal';
import PlaylistModal from './PlaylistModal';

const stateSelector = createSelector(
  state => state.tracks.tracksById,
  state => state.filter.ids,
  state => state.tracks.selected,
  (tracksById, tracks, selected) => ({ tracksById, tracks, selected })
);

export default memo(() => {
  const { tracksById, tracks, selected } = useSelector(stateSelector);

  // Track Filtering
  const [filter, setFilter] = useState('');
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
  const searchFilter = useCallback(
    e => {
      setFilter(e.target.value.toLowerCase());
    },
    [setFilter]
  );

  // TrackList responsiveness
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
      handleWidthChange();
    }
  }, [sizeRef.current, handleWidthChange]);

  // Modals
  const [trackModalOpen, setTrackModalOpen] = useState(false);
  const [labelModalOpen, setLabelModalOpen] = useState(false);
  const [playlistModalOpen, setPlaylistModalOpen] = useState(false);
  const openLabelModal = useCallback(() => setLabelModalOpen(true), [
    setLabelModalOpen,
  ]);
  const openPlaylistModal = useCallback(() => setPlaylistModalOpen(true), [
    setPlaylistModalOpen,
  ]);

  return (
    <Wrapper>
      <TrackModal open={trackModalOpen} setOpen={setTrackModalOpen} />
      <LabelModal open={labelModalOpen} setOpen={setLabelModalOpen} />
      <PlaylistModal open={playlistModalOpen} setOpen={setPlaylistModalOpen} />
      <TrackToolBar
        searchFilter={searchFilter}
        openLabelModal={openLabelModal}
        openPlaylistModal={openPlaylistModal}
      />
      <div ref={sizeRef}>
        <AutoSizer>
          {({ height, width }) => (
            <List
              height={height}
              width={width}
              rowCount={filtered.length}
              rowHeight={48}
              rowRenderer={({ key, index, style }) => (
                <div key={key} style={style}>
                  <TrackSlide
                    track={tracksById[filtered[index]]}
                    checked={selected[filtered[index]] || false}
                    widthRestriction={widthRestriction}
                    setOpenTrack={setTrackModalOpen}
                  />
                </div>
              )}
              style={{ outline: 'none' }}
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
