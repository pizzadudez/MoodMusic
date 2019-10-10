import React, { Component } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';

import TrackSlide from './TrackSlide';

class TracksContainer extends Component {
  render() {
    if (!this.props.trackIds.length) {
      return <p>Loading...</p>;
    }
    const slides = this.props.trackIds.map(id => 
      <TrackSlide track={this.props.trackMap[id]} />
    );
    return (
      <Container>
        {slides}
      </Container>
    );
  }
}

const mapStateToProps = state => ({
  trackMap: state.tracks.trackMap,
  trackIds: state.tracks.trackIds,
  playlists: state.playlists.playlists,
  labels: state.labels.labels,
});

export default connect(mapStateToProps)(TracksContainer);

const Container = styled.div`
  grid-area: content;
  border: 1px solid black;
  height: 736px;
  overflow-y: scroll;
`;