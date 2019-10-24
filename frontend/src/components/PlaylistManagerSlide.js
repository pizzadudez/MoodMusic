import React, { Component } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import _ from 'lodash';

import { modifyPlaylistField } from '../actions/playlistActions';
import DropDown from './Playlist/DropDown';
import Switch from './Playlist/Switch';

class PlaylistManagerSlide extends Component {
  render() {
    const { playlist, labels, modifyPlaylistField } = this.props;
    return (
      <Container>
        <span>{playlist.name}</span>
        <DropDown 
          options={labels.genres}
          onClick={event => modifyPlaylistField(playlist.id, 'genre_id', event.target.value)}
        />
        <Switch 
          checked={playlist.mood_playlist ? true : false}
          onChange={event => modifyPlaylistField(playlist.id, 'mood_playlist', +event.target.checked)}
        />
        <Switch 
          checked={playlist.tracking ? true : false}
          onChange={event => modifyPlaylistField(playlist.id, 'tracking', +event.target.checked)}
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