import React, { Component } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';

import Label from './Label';
import PlaylistLabel from './PlaylistLabel';

class TrackSlide extends Component {
  render() {
    return (
      <Container>
        <Section>{this.props.track.name}</Section>
        <Section>{this.props.track.artist}</Section>
        <Section>{this.props.track.album.name}</Section>
        <Section>{this.props.track.rating}</Section>
        <LabelsSection>
          {this.props.labelIds.length ?
            this.props.track.label_ids.map(id => (
              <Label 
                label={this.props.labelMap[id]}
              />
            ))
            : null
          }
          {this.props.playlists[this.props.track.playlist_ids[0]] ?
            this.props.track.playlist_ids.map(id => (
              <PlaylistLabel 
                playlist={this.props.playlists[id]}
              />
            ))
            : null
          }
        </LabelsSection>
      </Container>
    );
  }
}

const mapStateToProps = state => ({
  playlists: state.playlists.playlists,
  labelIds: state.labels.labelIds,
  labelMap: state.labels.labelMap,
});

export default connect(mapStateToProps)(TrackSlide);

const Container = styled.div`
  background-color: palegreen;
  height: 28px;
  border-bottom: 1px solid green;
  padding: 8px 16px;
  font-size: 1em;
  display: grid;
  grid-template-columns: 
    minmax(180px, 2fr)
    minmax(120px, 1fr)
    minmax(70px, 1fr)
    minmax(20px, 30px)
    minmax(30px, 3fr);
  align-items: center;
`;

const Section = styled.span`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const LabelsSection = styled.div`
  display: flex;
  flex-direction: row;
`;

const Playlist = styled.span`
  padding: 0 5px;
  border-right: 1px solid black;
`;
