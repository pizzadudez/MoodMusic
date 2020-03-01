import React, { memo, useCallback, useState, useMemo } from 'react';
import { createSelector } from 'reselect';
import { useSelector } from 'react-redux';
import styled from 'styled-components';

import PlaylistSlide from './PlaylistSlide';
import Toolbar from './Toolbar';

const stateSelector = createSelector(
  state => state.playlists.playlistsById,
  state => state.labels.labelsById,
  (playlistsById, labelsById) => ({
    playlistsById,
    playlistIdsByType: Object.values(playlistsById).reduce(
      (obj, pl) => ({
        ...obj,
        [pl.type]: [...(obj[pl.type] || []), pl.id],
      }),
      {}
    ),
    labelsById,
  })
);

export default memo(() => {
  const { playlistsById, playlistIdsByType, labelsById } = useSelector(
    stateSelector
  );

  // Playlist Filter
  const [filter, setFilter] = useState('');
  const searchFilter = useCallback(
    e => setFilter(e.target.value.toLowerCase()),
    []
  );
  const filtered = useMemo(
    () =>
      Object.fromEntries(
        Object.entries(playlistIdsByType).map(([type, ids]) => {
          const filtered = ids.filter(id => {
            const { name, label_id: labelId } = playlistsById[id];
            const label = labelsById[labelId] || {};
            return [name, label.name, label.verbose, label.suffix].some(
              field => field && field.toLowerCase().includes(filter)
            );
          });
          return [type, filtered];
        })
      ),
    [filter, playlistsById, playlistIdsByType, labelsById]
  );

  const [updateForm, setUpdateForm] = useState(null);
  const toggleUpdate = useCallback(
    id => setUpdateForm(prev => (prev === id ? false : id)),
    []
  );

  return (
    <Container>
      <Toolbar searchFilter={searchFilter} />
      <SlidesContainer>
        {['label', 'mix', 'untracked', 'deleted'].map(
          type =>
            filtered[type] &&
            !!filtered[type].length && (
              <React.Fragment key={type}>
                <h2>{type[0].toUpperCase() + type.slice(1) + ' playlists'}</h2>
                {filtered[type].map(id => (
                  <PlaylistSlide
                    key={id}
                    playlist={playlistsById[id]}
                    toggleUpdate={toggleUpdate}
                    isUpdating={id === updateForm}
                  />
                ))}
              </React.Fragment>
            )
        )}
      </SlidesContainer>
    </Container>
  );
});

const Container = styled.div`
  max-height: 100%;
  display: grid;
  grid-template-rows: 50px calc(100% - 56px);
  grid-row-gap: 6px;
`;
const SlidesContainer = styled.div`
  display: grid;
  row-gap: 6px;
  overflow-y: auto;
  overflow-x: hidden;
  > h2 {
    color: #c1c1c152;
    margin-block-end: 12px;
    font-size: 2rem;
  }
`;
