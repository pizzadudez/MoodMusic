import React, { Component } from 'react';
import styled from 'styled-components';

export default class LabelButton extends Component {
  shouldComponentUpdate(nextProps) {
    return this.props.checked !== nextProps.checked ? true : false;
  }
  render() {
    const { label, checked, onChange } = this.props;
    return (
      <Container>
        <CheckBox
          id={label.id}
          type="checkbox"
          checked={checked}
          onChange={onChange}
          value={label.id}
        />
        <Label htmlFor={label.id} label={label}>
          <span>{label.name}</span>
        </Label>
      </Container>
    );
  }
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
    font-size: ${props => props.label.type === 'subgenre' ? 0.9 : 1.2}em;
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