import React, { Component } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';

import {
  selectAllTracks,
  deselectAllTracks,
} from '../actions/actions';
import SearchBar from './SearchBar';

class TrackOperations extends Component {
  render() {
    const { selectAllTracks, deselectAllTracks } = this.props;

    return (
      <Container>
        <SelectButton onClick={() => selectAllTracks()}>V</SelectButton>
        <SelectButton onClick={() => deselectAllTracks()}>X</SelectButton>
        <SearchBar />
      </Container>
    );
  }
}

const mapStateToProps = state => ({

});

export default connect(mapStateToProps, {
  selectAllTracks, deselectAllTracks,
})(TrackOperations);

const SelectButton = styled.button`
  margin: 0 2px;
`;
const Container = styled.div`
  height: 40px;
`;