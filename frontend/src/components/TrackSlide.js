import React, { Component } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';

import { selectTrack } from '../actions/actions';
import Label from './Label';
import PlaylistLabel from './PlaylistLabel';

class TrackSlide extends Component {
  render() {
    const { track, trackIdsSelected, selectTrack } = this.props;
    return (
      <Container>
        <input
          type="checkbox"
          checked={trackIdsSelected[track.id] ? true : false}
          onChange={() => selectTrack(track.id)}
        />
        <Section>{this.props.track.name}</Section>
        <Section>{this.props.track.artist}</Section>
        <Section>{this.props.track.album.name}</Section>
        <Section>{this.props.track.rating}</Section>
        <LabelsSection>
          {this.props.labelIds.length ?
            this.props.track.label_ids.map(id => (
              <Label
                key={id} 
                label={this.props.labelMap[id]}
              />
            ))
            : null
          }
          {this.props.playlists[this.props.track.playlist_ids[0]] ?
            this.props.track.playlist_ids.map(id => (
              <PlaylistLabel
                key={id}
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
  trackIdsSelected: state.tracks.trackIdsSelected,
  playlists: state.playlists.playlists,
  labelIds: state.labels.labelIds,
  labelMap: state.labels.labelMap,
});

export default connect(
  mapStateToProps,
  {
    selectTrack,
  }
)(TrackSlide);

const Container = styled.div`
  background-color: #333333;
  height: 30px;
  border-bottom: 1px solid #272727;
  padding: 4px 16px;
  display: grid;
  grid-template-columns: 
    15px
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
  padding: 0 3px;
  color: #3fe479;
  font-size: 1.05em;
  text-shadow: 0.7px 0.9px #00000099;
`;

const LabelsSection = styled.div`
  display: flex;
  flex-direction: row;
`;
