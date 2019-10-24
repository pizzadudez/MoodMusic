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
        <Button onClick={() => selectAllTracks()}>V</Button>
        <Button onClick={() => deselectAllTracks()}>X</Button>
        <SearchBar />
        <Button>Add / Remove Labels</Button>
        <Button>Add / Remove Tracks</Button>
      </Container>
    );
  }
}

const mapStateToProps = state => ({

});

export default connect(mapStateToProps, {
  selectAllTracks, deselectAllTracks,
})(TrackOperations);

const Button = styled.button`
  margin: 0 2px;
`;
const Container = styled.div`
  height: 40px;
`;