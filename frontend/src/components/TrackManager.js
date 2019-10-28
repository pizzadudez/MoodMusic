import React, { Component } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';

class TrackManager extends Component {
  constructor(props) {
    super(props);
    const { track } = props;
    this.state = {
      default: {
        ...[...track.label_ids, ...track.playlist_ids].reduce((obj, id) => ({
          ...obj,
          [id]: true,
        }), {})
      },
      selected: {}
    }
  }
  handleClick = event => this.setState({
    selected: {
      ...this.state.selected,
      [event.target.id]: !this.state.selected[event.target.id],
    }
  });
  render() {
    const { track, labels, playlists } = this.props;
    const labelSelect = <Labels>
      <p>Genres</p>
      {labels.genres.map(id => (
        <div key={id}>
        {[id, ...labels.subgenres[id] || []].map(id => (
          <Button
            key={id}
            id={id}
            default={this.state.default[id]}
            selected={this.state.selected[id]}
            onClick={this.handleClick}
          >{labels.map[id].name}</Button>
        ))}
        </div>
      ))}
      <p>Moods</p>
      {labels.moods.map(id => (
        <Button
          key={id}
          id={id}
          default={this.state.default[id]}
          selected={this.state.selected[id]}
          onClick={this.handleClick}
        >{labels.map[id].name}</Button>
      ))}
    </Labels>
    const playlistSelect = <Playlists>
      <p>Playlists</p>
      {[...playlists.custom].map(id => (
        <Button
          key={id}
          id={id}
          default={this.state.default[id]}
          selected={this.state.selected[id]}
          onClick={this.handleClick}
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
      </Container>
    );
  }
}

const mapStateToProps = state => ({
  labels: state.labels,
  playlists: state.playlists,
});

export default connect(mapStateToProps, {

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