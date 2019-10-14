import React from 'react';
import styled from 'styled-components';

export default (props) => {
  const { label, onChange } = props;
  return (
    <Container>
      <CheckBox
        id={label.id}
        type="checkbox"
        onChange={onChange}
        value={label.id}
      />
      <Label htmlFor={label.id}>
        <span>{label.name}</span>
      </Label>
    </Container>
  );
}

const Container = styled.div`
  margin: 2px;
  position: relative;
`;
const Label = styled.label`
  border: 1px solid black;
  border-radius: 3px;
  user-select: none;
  cursor: pointer;
  &:hover {
    background-color: tomato;
  }
  span {
    padding: 4px;
    margin: auto;
  }
`;
const CheckBox = styled.input`
  position: absolute;
  top: 0;
  left: 0;
  opacity: 0;
  z-index: -1;
  &:checked + label {
    background-color: paleturquoise;
    &:hover {
      background-color: palevioletred;
    }
  }
`;