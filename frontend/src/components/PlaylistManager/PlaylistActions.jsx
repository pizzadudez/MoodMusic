import React, { memo } from 'react';
import styled from 'styled-components';
import { CSSTransition } from 'react-transition-group';

import Button from '../common/Button';
import EditIcon from '@material-ui/icons/Edit';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import ListIcon from '@material-ui/icons/List';

export default memo(({ isOpen, update }) => {
  return (
    <CSSTransition
      in={isOpen}
      timeout={500}
      classNames="form"
      appear
      unmountOnExit
    >
      <Container>
        <div
          style={{
            display: 'grid',
            gridAutoFlow: 'column',
            gridAutoColumns: 'min-content',
            columnGap: 10,
            width: 500,
          }}
        >
          <Button variant="open" onClick={update} startIcon={<EditIcon />}>
            Modify
          </Button>
          <Button variant="open" disabled startIcon={<ListIcon />}>
            Tracks
          </Button>
          <Button variant="special" disabled>
            Sync
          </Button>
          <Button variant="special" disabled>
            Revert
          </Button>
          <Button
            variant="danger"
            startIcon={<DeleteOutlineIcon />}
            tooltip="Delete playlist."
          />
        </div>
      </Container>
    </CSSTransition>
  );
});

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;

  min-width: 0;
  width: 0;
  opacity: 0;
  transition: 0.5s;
  &.form-appear {
    transition: none;
    width: 100%;
    opacity: 1;
  }
  &.form-enter-active,
  &.form-enter-done {
    width: 100%;
    opacity: 1;
  }
  &.form-exit-active,
  &.form-exit-done {
    width: 1%;
    opacity: 0;
  }
`;
