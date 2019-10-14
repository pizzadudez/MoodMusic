import React, { Component } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';

import TrackSlide from './TrackSlide';
import SearchBar from './SearchBar';

class TracksContainer extends Component {
  render() {
    if (!this.props.trackIds.length) {
      return <p>Loading...</p>;
    }
    const trackIds = this.props.trackIdsSearch.length
      ? this.props.trackIdsSearch
      : this.props.trackIds
    const slides = trackIds.map(id => 
      <TrackSlide key={id} track={this.props.trackMap[id]} />
    );
    return (
      <Wrapper>
        <SearchBar />
        <Container>
          {slides}
        </Container>
      </Wrapper>
    );
  }
}

const mapStateToProps = state => ({
  trackMap: state.tracks.trackMap,
  trackIds: state.tracks.trackIds,
  trackIdsSearch: state.tracks.trackIdsSearch,
  playlists: state.playlists.playlists,
  labels: state.labels.labels,
});

export default connect(mapStateToProps)(TracksContainer);

const Container = styled.div`
  border: 1px solid #272727;
  overflow-y: scroll;
  height: 80vh;
`;

const Wrapper = styled.div`
  grid-area: content;
`;