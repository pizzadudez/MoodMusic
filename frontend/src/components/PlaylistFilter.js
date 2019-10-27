import React, { Component } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';

import {
  filterByPlaylist,
  selectAllPlaylistFilters,
  deselectAllPlaylistFilters,
} from '../actions/filterActions';
import PlaylistFilterButton from './PlaylistFilterButton';

class PlaylistFilter extends Component {
  handleChange = event => this.props.filterByPlaylist(event.target.value)
  render() {
    const { playlists, filters, selectAllPlaylistFilters, 
      deselectAllPlaylistFilters } = this.props;
    return (
      <Container>
        <p>Default Playlists</p>
        <button onClick={() => selectAllPlaylistFilters()}>All</button>
        <button onClick={() => deselectAllPlaylistFilters()}>None</button>
        {playlists.default.map(id => (
          <PlaylistFilterButton
            key={id}
            playlist={playlists.map[id]}
            onChange={this.handleChange}
            checked={filters[id] ? true : false}
          />
        ))}
        <p>Custom Playlists</p>
      </Container>
    );
  }
}

const mapStateToProps = state => ({
  playlists: {
    map: state.playlists.map,
    default: state.playlists.default,
    custom: state.playlists.custom,
    filter: state.playlists.filter,
  },
  filters: state.filter.playlists,
});

export default connect(mapStateToProps, {
  filterByPlaylist, selectAllPlaylistFilters, deselectAllPlaylistFilters,
})(PlaylistFilter);

const Container = styled.div`
  height: 300px;
  background-color: #292929;
  color: #bdbdbd;
`;