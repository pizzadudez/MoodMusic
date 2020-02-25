import React, { memo, useCallback, useState } from 'react';
import { createSelector } from 'reselect';
import { useSelector } from 'react-redux';
import styled from 'styled-components';

import Button from '../common/Button';
import LabelCard from './LabelCard';
import LabelForm from './LabelForm';
import { useMemo } from 'react';
import Toolbar from './Toolbar';

const stateSelector = createSelector(
  state => state.labels.labelsById,
  state => state.labels.ids,
  (labelsById, labels) => ({ labelsById, labels })
);

export default memo(() => {
  const { labelsById, labels } = useSelector(stateSelector);

  // Card Filtering
  const [filter, setFilter] = useState('');
  const filtered = useMemo(
    () =>
      labels.filter(id => {
        const { name, verbose, suffix } = labelsById[id];
        return [name, verbose, suffix].some(
          field => field && field.toLowerCase().includes(filter)
        );
      }),
    [filter, labels, labelsById]
  );
  const searchFilter = useCallback(
    e => setFilter(e.target.value.toLowerCase()),
    []
  );

  // Form Handling
  const [createForm, setCreateForm] = useState(false);
  const [updateForm, setUpdateForm] = useState(false);
  const update = useCallback(id => {
    setCreateForm(false);
    setUpdateForm(prev => (prev === id ? false : id));
  }, []);
  const create = useCallback(() => {
    setUpdateForm(false);
    setCreateForm(true);
  }, []);
  const close = useCallback(() => {
    setCreateForm(false);
    setUpdateForm(false);
  }, []);

  return (
    <Wrapper>
      <Toolbar searchFilter={searchFilter} openCreateForm={create} />
      <LabelContainer>
        <LabelForm close={close} isOpen={createForm} />
        {filtered.map(id => (
          <LabelCard
            key={id}
            label={labelsById[id]}
            update={update}
            formOpen={updateForm === id}
          />
        ))}
      </LabelContainer>
    </Wrapper>
  );
});

const Wrapper = styled.div`
  height: 100%;
  display: grid;
  grid-template-rows: 50px calc(100% - 56px);
  grid-row-gap: 6px;
`;
const LabelContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  overflow: auto;
`;
