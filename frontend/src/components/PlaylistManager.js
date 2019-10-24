import React, { Component } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';

import PlaylistManagerSlide from './PlaylistManagerSlide';

class PlaylistManager extends Component {
  render() {
    const { playlists } = this.props;
    return (
      <Container>
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

})(PlaylistManager);

const Container = styled.div`
  grid-area: content;
`;