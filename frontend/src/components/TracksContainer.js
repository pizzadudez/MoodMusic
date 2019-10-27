import React, { Component } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';

import TrackSlide from './TrackSlide';
import TrackOperations from './TrackOperations';
import Modal from './Modal';
import TrackManager from './TrackManager';

class TracksContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      trackManagerOpen: false,
      trackId: null,
    };
  }
  handleTrackManager(trackId) {
    this.setState({
      trackManagerOpen: !this.state.trackManagerOpen,
      trackId: this.state.trackId ? null : trackId,
    });
  }
  render() {
    const { loadingFinished, tracks, filtered } = this.props;
    if (!loadingFinished) return <Wrapper>Loading...</Wrapper>;
    
    return (
      <Wrapper>
        <TrackOperations />
        <Container>
          {filtered.map(id => 
            <TrackSlide key={id} track={tracks.map[id]} onClick={() => this.handleTrackManager(id)}/>
          )}
        </Container>
        {this.state.trackManagerOpen ? (
          <Modal onClick={() => this.handleTrackManager()}>
            <TrackManager 
              trackId={this.state.trackId}
            />
          </Modal>
        ) : null}
      </Wrapper>
    );
  }
}

const mapStateToProps = state => ({
  loadingFinished: state.app.loadingFinished,
  tracks: state.tracks,
  filtered: state.filter.tracks,
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