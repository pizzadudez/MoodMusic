import React, { Component } from 'react';
import styled from 'styled-components';

export default class SelectorButton extends Component {
  shouldComponentUpdate(nextProps) {
    if (this.props.checked !== nextProps.checked
      || this.props.adding !== nextProps.adding
    ) return true;
    return false; 
  }
  render() {
    const { name, id, color, checked, adding, onChange } = this.props;
    return (
      <Label
        adding={adding}
        checked={checked}
        color={color}
      >
        <CheckBox 
          type="checkbox"
          checked={checked}
          onChange={onChange}
          value={id}
        /> 
        <span>{name}</span>
      </Label>
    );
  }
}

const Label = styled.label`
  position: relative;
  display: inline-flex;
  border-radius: 3px;
  margin: 3px;
  user-select: none;
  cursor: pointer;
  border: 1px solid ${props => {
    if (props.checked) {
      return props.adding ? '#3fe479' : '#e43f3f'
    }
  }};
  box-shadow: ${props => {
    if (props.checked) {
      return '0 0 6px' + (props.adding ? ' #3fe479' : ' #e43f3f');
    } else {
      return 'none';
    }
  }};
  span {
    padding: 3px 4px;
  }
`;
const CheckBox = styled.input`
  position: absolute;
  opacity: 0;
  z-index: -1;
`;