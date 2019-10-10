import React, { Component } from 'react';
import styled from 'styled-components';

class Dropdown extends Component {
  render() {
    const options = this.props.options.map(option => (
      <Option>{option}</Option>
    ));
    return (
      <Select
        onChange={this.props.onClick}  
      >
        {options}
      </Select>
    );
  }
}

export default Dropdown;

const Select = styled.select`
  -webkit-appearance: none;  /*Removes default chrome and safari style*/
  -moz-appearance: none; /* Removes Default Firefox style*/
  appearance:none;
  border: 0 !important;
  background: #0088cc url(img/select-arrow.png) no-repeat 90% center;
  width: 100px; /*Width of select dropdown to give space for arrow image*/
  text-indent: 0.01px; /* Removes default arrow from firefox*/
  text-overflow: "";  /*Removes default arrow from firefox*/ /*My custom style for fonts*/
  color: #FFF;
  padding: 5px;
  box-shadow: inset 0 0 5px rgba(000,000,000, 0.5);
`;

const Option = styled.option`
`;

