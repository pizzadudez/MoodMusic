import React, { Component } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';

import { filterByPlaylist } from '../actions/filterActions';
import PlaylistFilter from './PlaylistFilter';

class PlaylistView extends Component {
  handleChange = event => this.props.filterByPlaylist(event.target.value)
  render() {
    const { playlists, playlistIds } = this.props;
    return (
      <Container>
        <p>Default Playlists</p>
        {playlistIds.default.map(id => (
          <PlaylistFilter
            playlist={playlists[id]}
            onChange={this.handleChange}
            checked={playlistIds.filter[id] ? true : false}
          />
        ))}
        <p>Custom Playlists</p>
      </Container>
    );
  }
}

const mapStateToProps = state => ({
  playlists: state.playlists,
  playlistIds: state.playlistIds,
});

export default connect(mapStateToProps, {
  filterByPlaylist,
})(PlaylistView);

const Container = styled.div`
  height: 300px;
  background-color: #292929;
  color: #bdbdbd;
`;