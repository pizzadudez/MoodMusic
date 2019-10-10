import React, { Component } from 'react';
import styled from 'styled-components';

class Dropdown extends Component {
  render() {
    const options = this.props.options.map(option => (
      <Option
        value={option}
        onClick={this.props.onClick}
      >
        {option}
      </Option>
    ));
    return (
      <Container>
        {options}
      </Container>
    );
  }
}

export default Dropdown;

const Container = styled.ul`
  background-color: palevioletred;
  position: absolute;
  z-index: 1;
  opacity: 0;
`;

const Option = styled.li`
  &:hover {
    background-color: red;
  }
  &:active {
    background-color: green;
  }
`;