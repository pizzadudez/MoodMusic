import React, { Component } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import _ from 'lodash';

import { modifyPlaylistField } from '../actions/playlistActions';
import DropDown from './Playlist/DropDown';
import Switch from './Playlist/Switch';

class PlaylistManagerSlide extends Component {
  constructor(props) {
    super(props);
    const { genre_id, mood_playlist, tracking } = props.playlist;
    this.state = {
      genre_id,
      mood_playlist,
      tracking,
    }
  }
  handleGenre = event => {
    const { modifyPlaylistField, playlist } = this.props;
    const value = event.target.value;
    this.setState({ genre_id: value});
    modifyPlaylistField(playlist.id, 'genre_id', value);
  }
  handleMoodPlaylist = event => {
    const { modifyPlaylistField, playlist } = this.props;
    const value = +event.target.checked;
    this.setState({ mood_playlist: value});
    modifyPlaylistField(playlist.id, 'mood_playlist', value);
  }
  handleTracking = event => {
    const { modifyPlaylistField, playlist } = this.props;
    const value = +event.target.checked;
    this.setState({ tracking: value});
    modifyPlaylistField(playlist.id, 'tracking', value);
  }
  render() {
    const { playlist, labels, modifyPlaylistField } = this.props;
    return (
      <Container>
        <span>{playlist.name}</span>
        <DropDown 
          options={labels.genres}
          onClick={this.handleGenre}
        />
        <Switch 
          checked={this.state.mood_playlist ? true : false}
          onChange={this.handleMoodPlaylist}
        />
        <Switch 
          checked={this.state.tracking ? true : false}
          onChange={this.handleTracking}
        />
      </Container>
    );
  }
}

const mapStateToProps = state => ({
  labels: { 
    map: state.labels.map,
    genres: state.labels.genres,
  },
});

export default connect(mapStateToProps, {
  modifyPlaylistField,
})(PlaylistManagerSlide)

const Container = styled.div`
  display: grid;
  grid-template-columns:
    minmax(100px, 1fr)
    minmax(100px, 1fr)
    minmax(150px, 1fr)
    minmax(150px, 1fr);
  align-items: center;
  height: 50px;
  background-color: tomato;
  border-bottom: 1px solid black;

  button {
    margin-right: 10px;
    padding: 5px;
  }
`;