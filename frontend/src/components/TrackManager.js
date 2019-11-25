import React, { Component } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';

import {
  modifyTrackLabels,
  modifyPlaylistTracks,
} from '../actions/trackActions';

class TrackManager extends Component {
  constructor(props) {
    super(props);
    const { track } = props;
    this.state = {
      defaultLabels: {
        ...track.label_ids.reduce((obj, id) => ({
          ...obj,
          [id]: true,
        }), {})
      },
      defaultPlaylists: {
        ...track.playlist_ids.reduce((obj, id) => ({
          ...obj,
          [id]: true,
        }), {})
      },
      selectedLabels: {},
      selectedPlaylists: {}
    }
  }
  handleClickLabel = event => this.setState({
    selectedLabels: {
      ...this.state.selectedLabels,
      [event.target.id]: !this.state.selectedLabels[event.target.id],
    }
  });
  handleClickPlaylist = event => this.setState({
    selectedPlaylists: {
      ...this.state.selectedPlaylists,
      [event.target.id]: !this.state.selectedPlaylists[event.target.id],
    }
  });
  handleUpdate = () => {
    const { defaultLabels, selectedLabels,
      defaultPlaylists, selectedPlaylists
    } = this.state;
    
    const labels = Object.keys(selectedLabels).reduce((obj, id) => {
      obj[defaultLabels[id] ? 'toRemove' : 'toAdd'][id] = true;
      return obj;
    }, { toAdd: {}, toRemove: {}, trackId: this.props.track.id });
    const playlists = Object.keys(selectedPlaylists).reduce((obj, id) => {
      obj[defaultPlaylists[id] ? 'toRemove' : 'toAdd'][id] = true;
      return obj;
    }, { toAdd: {}, toRemove: {}, trackId: this.props.track.id });

    this.props.modifyTrackLabels(labels);
    this.props.modifyPlaylistTracks(playlists);
  }
  render() {
    const { track, labels, playlists } = this.props;
    // Labels
    const labelSelect = <Labels>
      <p>Genres</p>
      {labels.genres.map(id => (
        <div key={id}>
        {[id, ...labels.subgenres[id] || []].map(id => (
          <Button
            key={id}
            id={id}
            default={this.state.defaultLabels[id]}
            selected={this.state.selectedLabels[id]}
            onClick={this.handleClickLabel}
          >{labels.map[id].name}</Button>
        ))}
        </div>
      ))}
      <p>Moods</p>
      {labels.moods.map(id => (
        <Button
          key={id}
          id={id}
          default={this.state.defaultLabels[id]}
          selected={this.state.selectedLabels[id]}
          onClick={this.handleClickLabel}
        >{labels.map[id].name}</Button>
      ))}
    </Labels>
    // Playlists
    const playlistSelect = <Playlists>
      <p>Playlists</p>
      {[...playlists.custom].map(id => (
        <Button
          key={id}
          id={id}
          default={this.state.defaultPlaylists[id]}
          selected={this.state.selectedPlaylists[id]}
          onClick={this.handleClickPlaylist}
        >{playlists.map[id].name}</Button>
      ))}
    </Playlists>

    return (
      <Container>
        <Header>
          <p>{track.name}</p>
        </Header>
        {labelSelect}
        {playlistSelect}
        <button onClick={this.handleUpdate}>Done</button>
      </Container>
    );
  }
}

const mapStateToProps = state => ({
  labels: state.labels,
  playlists: state.playlists,
});

export default connect(mapStateToProps, {
  modifyTrackLabels, modifyPlaylistTracks,
})(TrackManager);

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;
const Header = styled.div`

`;
const Labels = styled.div`

`;
const Playlists = styled.div`

`;
const Button = styled.button`
  background-color: ${props => props.default
    ? props.selected ? 'red' : 'yellow'
    : props.selected ? 'green' : 'white'
  };
`;