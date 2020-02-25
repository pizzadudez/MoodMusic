import React, { memo } from 'react';
import styled from 'styled-components';

import Button from '../common/Button';
import ExpandButton from '../common/ExpandButton';
import Label from '../common/Label';
import LabelForm from './LabelForm';
import { useState } from 'react';
import { useCallback } from 'react';
import { Transition } from 'react-transition-group';

export default memo(({ label, update, formOpen }) => {
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
          <li>Type: {label.type}</li>
          {label.playlist_id && <li>Playlist: {label.playlist_id}</li>}
          {label.parent_id && <li>Genre: {label.parent_id}</li>}
          {label.subgenre_ids && <li>subgenres: {label.subgenre_ids}</li>}
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
const Details = styled.div``;

const StyledLabel = styled(Label)`
  cursor: default;
  height: 56px;
  min-width: 86px;
  font-size: 1rem;
  span {
    padding: 0 12px;
  }
`;
