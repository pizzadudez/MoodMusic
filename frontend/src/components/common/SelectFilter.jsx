import React, { memo } from 'react';
import styled from 'styled-components';

export default memo(({ text, value, onChange, checked }) => {
  return (
    <Container>
      <Input
        id={'plFilter_' + value}
        type="checkbox"
        value={value}
        onChange={onChange}
        checked={checked}
      />
      <Label htmlFor={'plFilter_' + value}>
        <span>{text}</span>
      </Label>
    </Container>
  );
});

const Container = styled.div`
  position: relative;
  margin-bottom: 2px;
`;
const Label = styled.label`
  position: relative;
  user-select: none;
  cursor: pointer;
  &::before {
    content: '';
    opacity: 0;
    width: 4px;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
    background-color: #3fe479;
  }
  span {
    margin-left: 4px;
    padding: 0 3px;
  }
  &:hover {
    span {
      color: white;
    }
  }
`;
const Input = styled.input`
  position: absolute;
  opacity: 0;
  z-index: -1;
  &:checked {
    ~ label {
      &::before {
        opacity: 1;
      }
      span {
        color: white;
      }
    }
  }
`;
