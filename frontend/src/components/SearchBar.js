import React, { Component } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';

import { filterBySearch, removeSearchFilter } from '../actions/filterActions';

class SearchBar extends Component {
  constructor(props) {
    super(props);
    this.input = React.createRef();
  }
  handleChange = event => this.props.filterBySearch(event.target.value)
  delete = () => {
    this.input.current.value = ''
    this.props.removeSearchFilter()
  }
  render() {
    return (
      <React.Fragment>
        <input 
          type="text" name="search" 
          onChange={this.handleChange}
          autoComplete="off"
          ref={this.input}
        />
        <button onClick={this.delete}>Clear</button>
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => ({
  searchFilter: state.filter.searchFilter,
});

export default connect(mapStateToProps, {
  filterBySearch, removeSearchFilter,
})(SearchBar);