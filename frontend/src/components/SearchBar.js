import React, { Component } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';

import { tracksSearch } from '../actions/actions';

class SearchBar extends Component {
  handleChange(e) {
    this.props.tracksSearch(e.target.value);
  }
  render() {
    return (
      <input 
        type="text" name="search" 
        onChange={this.handleChange.bind(this)}
        autoComplete="off"
      />
    );
  }
}

const mapStateToProps = state => ({

});

export default connect(mapStateToProps, { tracksSearch })(SearchBar);