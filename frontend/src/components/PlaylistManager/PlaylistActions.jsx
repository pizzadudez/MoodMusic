import React, { memo } from 'react';
import styled from 'styled-components';

import Button from '../common/Button';
import { CSSTransition } from 'react-transition-group';

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
        <div style={{ width: 400 }}>
          <Button onClick={update}>Update</Button>
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
