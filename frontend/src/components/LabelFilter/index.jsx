import React, { memo, useCallback, useState, useEffect } from 'react';
import { createSelector } from 'reselect';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';

import LabelButton from './LabelButton';
import { filterByLabel, removeLabelFilter } from '../../actions/filterActions';

const stateSelector = createSelector(
  state => state.labels,
  state => state.filter.labels,
  ({ labelsById, ids: labelIds }, filter) => ({
    labelsById,
    genreIds: labelIds.filter(id => labelsById[id].type === 'genre'),
    moodIds: labelIds.filter(id => labelsById[id].type === 'mood'),
    filter,
  })
);

export default memo(() => {
  const dispatch = useDispatch();
  const { labelsById, genreIds, moodIds, filter } = useSelector(stateSelector);

  const include = useCallback(id => dispatch(filterByLabel(id, 'include')), [
    dispatch,
  ]);
  const exclude = useCallback(id => dispatch(filterByLabel(id, 'exclude')), [
    dispatch,
  ]);
  const resetFilter = useCallback(() => {
    dispatch(removeLabelFilter());
  }, [dispatch]);

  return (
    <Wrapper>
      <button onClick={resetFilter}>NO FILTER</button>
      <div>
        <h3>Genres</h3>
        {genreIds.map(id =>
          [id, ...(labelsById[id].subgenre_ids || [])].map(id => (
            <LabelButton
              key={id}
              itemId={id}
              color={labelsById[id].color}
              include={include}
              exclude={exclude}
              state={
                filter.include[id]
                  ? 'add'
                  : filter.exclude[id]
                  ? 'remove'
                  : false
              }
            >
              {labelsById[id].name}
            </LabelButton>
          ))
        )}
      </div>
      <div>
        <h3>Moods</h3>
        {moodIds.map(id => (
          <LabelButton
            key={id}
            itemId={id}
            color={labelsById[id].color}
            left={include}
            right={exclude}
            state={
              filter.include[id] ? 'add' : filter.exclude[id] ? 'remove' : false
            }
          >
            {labelsById[id].name}
          </LabelButton>
        ))}
      </div>
    </Wrapper>
  );
});

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
`;
