import React, { Component } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';

import { filterByPlaylist } from '../actions/filterActions';
import PlaylistFilter from './PlaylistFilter';

class PlaylistView extends Component {
  handleChange = event => this.props.filterByPlaylist(event.target.value)
  render() {
    const { playlists } = this.props;
    return (
      <Container>
        <p>Default Playlists</p>
        {playlists.default.map(id => (
          <PlaylistFilter
            key={id}
            playlist={playlists.map[id]}
            onChange={this.handleChange}
            checked={playlists.filter[id] ? true : false}
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
});

export default connect(mapStateToProps, {
  filterByPlaylist,
})(PlaylistView);

const Container = styled.div`
  height: 300px;
  background-color: #292929;
  color: #bdbdbd;
`;