import React, { memo, useCallback } from 'react';
import { createSelector } from 'reselect';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';

import FilterButton from './common/FilterButton';
import { filterByLabel, removeLabelFilter } from '../actions/filterActions';

const stateSelector = createSelector(
  state => state.labels,
  state => state.filter,
  (labels, filter) => ({
    labelsById: labels.labelsById,
    filtered: filter.labels,
    genreIds: labels.ids.filter(id => labels.labelsById[id].type === 'genre'),
    moodIds: labels.ids.filter(id => labels.labelsById[id].type === 'mood'),
  })
);

export default memo(() => {
  // console.log('LabelFilter');
  const dispatch = useDispatch();
  const { labelsById, filtered, genreIds, moodIds } = useSelector(
    stateSelector
  );

  const filter = useCallback(
    id => e => {
      dispatch(filterByLabel(id));
    },
    [dispatch]
  );
  const noFilter = useCallback(() => {
    dispatch(removeLabelFilter());
  }, [dispatch]);

  return (
    <Wrapper>
      <button onClick={noFilter}>NO FILTER</button>
      Genres
      {genreIds.map(id => (
        <React.Fragment key={'genreGroup_' + id}>
          <FilterButton
            key={id}
            id={id}
            text={labelsById[id].name}
            onClick={filter}
            filter={filtered[id]}
          />
          {labelsById[id].subgenre_ids.map(id => (
            <FilterButton
              key={id}
              id={id}
              text={labelsById[id].name}
              onClick={filter}
              filter={filtered[id]}
            />
          ))}
        </React.Fragment>
      ))}
      Moods
      {moodIds.map(id => (
        <FilterButton
          key={id}
          id={id}
          text={labelsById[id].name}
          onClick={filter}
          filter={filtered[id]}
        />
      ))}
    </Wrapper>
  );
});

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, 60px);
`;
