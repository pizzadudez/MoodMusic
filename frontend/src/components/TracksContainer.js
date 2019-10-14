import React, { Component } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';


import TrackSlide from './TrackSlide';
import TrackOperations from './TrackOperations';

class TracksContainer extends Component {
  render() {
    if (!this.props.trackIds.length) {
      return <Wrapper>Loading...</Wrapper>;
    }
    const trackIds = this.props.trackIdsSearch.length
      ? this.props.trackIdsSearch
      : this.props.trackIds;
    return (
      <Wrapper>
        <TrackOperations />
        <Container>
          {trackIds.map(id => 
            <TrackSlide key={id} track={this.props.trackMap[id]} />
          )}
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

export default connect(mapStateToProps, {
})(TracksContainer);

const Wrapper = styled.div`
  grid-area: content;
`;
const Container = styled.div`
  border: 1px solid #272727;
  overflow-y: scroll;
  height: 80vh;
`;