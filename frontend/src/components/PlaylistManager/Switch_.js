import React, { Component } from 'react';
import styled from 'styled-components';
import Switch from '@material-ui/core/Switch';

export default class Switch extends Component {
  render() {
    const { checked, onChange } = this.props;
    return (
      <Label checked={checked}>
        <Input
          type="checkbox"
          checked={checked}
          onChange={onChange}
        />
      </Label>
    );
  }
}

const Label = styled.label`
  width: 100px;
  height: 50px;
  position: relative;
  background-color: magenta;
  &::before {
    content: '';
    height: 50px;
    width: 20px;
    background-color: black;
    position: absolute;
    top: 0;
    left: ${props => props.checked ? 0 : 'calc(100% - 20px)'}
  }
`;
const Input = styled.input`
  position: absolute
`;