import React, { Component } from 'react';
import styled from 'styled-components';

export default class LabelSelectorButton extends Component {
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
  display: inline-block;
  min-width: 30px;
`;
const Label = styled.label`
  display: flex;
  border-radius: 3px;
  border: 1px solid black;
  user-select: none;
  cursor: pointer;
  &:hover {
    background-color: tomato;
  }
  span {
    padding: 2px 4px;
    font-weight: ${props => props.label.type === 'subgenre' ? 400 : 600};
    align-content: center;
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