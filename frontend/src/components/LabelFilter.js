import React, { Component } from 'react';
import styled from 'styled-components';

export default class LabelFilter extends Component {
  shouldComponentUpdate(nextProps) {
    return !(nextProps.filter === this.props.filter)
  }
  render () {
    const { label, filter, onClick } = this.props;
    return(
      <Button 
        value={label.id}
        filter={filter === true ? 'include' : filter === false ? 'exclude' : null}
        onClick={onClick}
      >
        {label.name}
      </Button>
    );
  }
}

const Button = styled.button`
  margin: 2px;
  background-color: ${props => {
    switch (props.filter) {
      case 'include':
        return 'green';
      case 'exclude':
        return 'tomato';
      default:
        return 'gray';
    }
  }};
`;