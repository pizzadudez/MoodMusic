import React, { Component } from 'react';
import styled from 'styled-components';

export default class PlaylistFilter extends Component {
  render() {
    const { playlist, checked, onChange } = this.props;
    return (
      <Container>
        <Input 
          id={'filter' + playlist.id}
          value={playlist.id}
          type="checkbox"
          checked={checked}
          onChange={onChange}
        />
        <Label 
          htmlFor={'filter' + playlist.id}
        >
          <span>{playlist.name}</span>
        </Label>
      </Container>
    );
  }
}

const Container = styled.div`
  position: relative;
  margin-bottom: 2px;
`;

const Label = styled.label`
  position: relative;
  user-select: none;
  cursor: pointer;
  &::before {
    content: "";
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