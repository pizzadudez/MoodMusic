import React, { Component } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';

import { submitPlaylistChanges } from '../../actions/playlistActions';
import PlaylistManagerSlide from './PlaylistManagerSlide';

class PlaylistManager extends Component {
  render() {
    const { playlists, submitPlaylistChanges } = this.props;
    return (
      <Container>
        <button onClick={() => submitPlaylistChanges()}>Submit Changes</button>
        {playlists.all.map(id => (
          <PlaylistManagerSlide
            key={id}
            playlist={playlists.map[id]}
          />
        ))}
      </Container>
    );
  }
}

const mapStateToProps = state => ({
  playlists: state.playlists,
});

export default connect(mapStateToProps, {
  submitPlaylistChanges,
})(PlaylistManager);

const Container = styled.div`
  grid-area: content;
`;