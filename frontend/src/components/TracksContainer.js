import React, { Component } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';

import TrackSlide from './TrackSlide';
import TrackOperations from './TrackOperations';

class TracksContainer extends Component {
  render() {
    const { loadingFinished, tracks } = this.props;

    if (!loadingFinished) return <Wrapper>Loading...</Wrapper>;
    const ids = tracks.searchFiltered.length
      ? tracks.searchFiltered
      : tracks.filtered;
    return (
      <Wrapper>
        <TrackOperations />
        <Container>
          {ids.map(id => 
            <TrackSlide key={id} track={tracks.map[id]} />
          )}
        </Container>
      </Wrapper>
    );
  }
}

const mapStateToProps = state => ({
  tracks: state.tracks,
  loadingFinished: state.changes.loadingFinished,
});

export default connect(mapStateToProps)(TracksContainer);

const Wrapper = styled.div`
  grid-area: content;
`;
const Container = styled.div`
  border: 1px solid #272727;
  overflow-y: scroll;
  height: 80vh;
`;