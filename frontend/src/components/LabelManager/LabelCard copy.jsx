import React, { memo } from 'react';
import styled from 'styled-components';

import Button from '../common/Button';
import ExpandButton from '../common/ExpandButton';
import Label from '../common/Label';
import LabelForm from '../LabelForm';
import { useState } from 'react';
import { useCallback } from 'react';
import { Transition } from 'react-transition-group';

export default memo(({ label, update }) => {
  console.log('>LabelCard');
  const [formOpen, setFormOpen] = useState(false);
  const toggle = useCallback(() => setFormOpen(open => !open), [setFormOpen]);
  const close = useCallback(
    e => {
      e.preventDefault();
      setFormOpen(false);
    },
    [setFormOpen]
  );

  return (
    <Paper>
      <Container>
        <div style={{ display: 'flex', flexWrap: 'nowrap' }}>
          <StyledLabel color={label.color} name={label.name} />
          <span>{label.verbose || label.name}</span>
          <ExpandButton onClick={toggle} expanded={formOpen}>
            Update
          </ExpandButton>
        </div>
        <div>
          <li>Type: {label.type}</li>
          {label.playlist_id && <li>Playlist: {label.playlist_id}</li>}
          {label.parent_id && <li>Genre: {label.parent_id}</li>}
          {label.subgenre_ids && <li>subgenres: {label.subgenre_ids}</li>}
        </div>
      </Container>
      <Transition in={formOpen} timeout={500}>
        {state => (
          <FormContainer state={state}>
            {!(state === 'exited') && <LabelForm id={label.id} />}
          </FormContainer>
        )}
      </Transition>
    </Paper>
  );
});

const Paper = styled.div`
  display: flex;
  background-color: #353535;
  color: white;
  min-height: 280px;
  min-width: 340px;
  transition: width 0.15s ease-in-out;
  padding: 6px;
  margin: 4px;
  border-radius: 4px;
  box-shadow: 0px 2px 1px -1px rgba(0, 0, 0, 0.2),
    0px 1px 1px 0px rgba(0, 0, 0, 0.14), 0px 1px 3px 0px rgba(0, 0, 0, 0.12);
`;
const Container = styled.div`
  display: flex;
  flex-direction: column;
`;
const StyledLabel = styled(Label)`
  cursor: default;
  height: 56px;
  min-width: 86px;
  font-size: 1rem;
  span {
    padding: 0 12px;
  }
`;
const FormContainer = styled.div`
  transition: 0.5s;
  overflow: hidden;
  background: green;
  padding: ${props => (props.state === 'exited' ? 0 : 3)}px;
  width: ${props =>
    ['entering', 'entered'].includes(props.state) ? 400 : 0}px;
`;
