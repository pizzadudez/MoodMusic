import React, { memo } from 'react';
import styled from 'styled-components';

import Button from '../common/Button';
import { CSSTransition } from 'react-transition-group';

export default memo(({ isOpen, close }) => {
  return (
    <CSSTransition
      in={isOpen}
      timeout={500}
      classNames="form"
      appear
      unmountOnExit
    >
      <Container>
        <Button onClick={close}>Cancel</Button>
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
  transition: 0.5s;
  &.form-enter-active,
  &.form-enter-done {
    width: 100%;
  }
  &.form-exit-active,
  &.form-exit-done {
    width: 0;
  }
`;
