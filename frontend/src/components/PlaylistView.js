import React, { Component } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';

import {
  addOrRemoveToPlaylists,
  postChanges2,
  modifyPlaylistSelection
} from '../actions/actions';
import PlaylistFilter from './PlaylistFilter';

class PlaylistView extends Component {
  handleChange = event => this.props.modifyPlaylistSelection(event.target.value)
  render() {
    const { playlists, addOrRemoveToPlaylists, postChanges2, loadingFinished } = this.props;
    if (!loadingFinished) return <Container>Loading</Container>;

    return (
      <Container>
        <p>Mood Playlists</p>
        {playlists.custom.map(id => (
          <PlaylistFilter
            key={id}
            playlist={playlists.map[id]}
            checked={playlists.selected[id] ? true : false}
            onChange={this.handleChange}
          />
        ))}

        <button onClick={() => addOrRemoveToPlaylists()}>Add to Playlists</button>
        <button onClick={() => addOrRemoveToPlaylists(false)}>Remove to Playlists</button>
        <button onClick={() => postChanges2()}>Submit Changes</button>
      </Container>
    );
  }
}

const mapStateToProps = state => ({
  playlists: state.playlists,
  loadingFinished: state.app.loadingFinished,
});

export default connect(mapStateToProps, {
  addOrRemoveToPlaylists, postChanges2, modifyPlaylistSelection,
})(PlaylistView);

const Container = styled.div`
  width: 300px;
  height: 400px;
  background-color: #292929;
  z-index: 3;
  position: absolute;
  color: #bdbdbd;
`;