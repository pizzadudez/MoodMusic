import React, { memo, useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { createSelector } from 'reselect';

import Dialog from '@material-ui/core/Dialog';
import Button from './Button2';

const stateSelector = createSelector(
  state => state.labels,
  ({ labelsById, ids: labelIds }) => ({
    labelsById,
    genreIds: labelIds.filter(id => labelsById[id].type === 'genre'),
    moodIds: labelIds.filter(id => labelsById[id].type === 'mood'),
  })
);

export default memo(({ open, setOpen }) => {
  const dispatch = useDispatch();
  const { labelsById, genreIds, moodIds } = useSelector(stateSelector);

  // Select
  const [toAdd, setToAdd] = useState({});
  const [toRemove, setToRemove] = useState({});
  const add = useCallback(
    (id, select = true) =>
      setToAdd(toAdd => ({
        ...toAdd,
        [id]: select,
      })),
    [setToAdd]
  );
  const remove = useCallback(
    (id, select = true) =>
      setToRemove(toRemove => ({
        ...toRemove,
        [id]: select,
      })),
    [setToRemove]
  );

  const updateAndClose = useCallback(() => {
    setOpen(false);
  }, [setOpen]);

  return (
    <StyledDialog open={open} onClose={updateAndClose}>
      <div>
        <h3>Genres</h3>
        {genreIds.map(id =>
          [id, ...(labelsById[id].subgenre_ids || [])].map(id => (
            <Button
              key={id}
              itemId={id}
              color={labelsById[id].color}
              add={add}
              remove={remove}
            >
              {labelsById[id].name}
            </Button>
          ))
        )}
      </div>
      <div>
        <h3>Moods</h3>
        {moodIds.map(id => (
          <Button
            key={id}
            itemId={id}
            color={labelsById[id].color}
            add={add}
            remove={remove}
          >
            {labelsById[id].name}
          </Button>
        ))}
      </div>
      <div>
        <pre>{JSON.stringify(toAdd, null, 2)}</pre>
        <pre>{JSON.stringify(toRemove, null, 2)}</pre>
      </div>
    </StyledDialog>
  );
});

const StyledDialog = styled(Dialog)`
  .MuiPaper-root {
    background-color: #1f1f1f;
    border-radius: 4px;
    min-width: 600px;
    min-height: 300px;
    padding: 10px 6px;
    color: white;
  }
  .MuiDialog-container {
    margin-top: -200px;
  }
`;
