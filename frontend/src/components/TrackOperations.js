import React, { Component } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';

import {
  selectAllTracks,
  deselectAllTracks,
  addLabels,
} from '../actions/actions';
import SearchBar from './SearchBar';

class TrackOperations extends Component {
  render() {
    const { trackIds } = this.props;

    return (
      <Container>
        <SelectButton onClick={() => selectAllTracks()}>V</SelectButton>
        <SelectButton onClick={() => deselectAllTracks()}>X</SelectButton>
        <SearchBar />
        <SelectButton onClick={() => addLabels(trackIds.selected)}>Add Labels</SelectButton>
      </Container>
    );
  }
}

const mapStateToProps = state => ({
  trackIds: state.tracks.trackIds,
});

export default connect(mapStateToProps, {
  selectAllTracks,
  deselectAllTracks,
  addLabels,
})(TrackOperations);

const SelectButton = styled.button`
  margin: 0 2px;
`;
const Container = styled.div`
  height: 40px;
`;