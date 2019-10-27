import React, { Component } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';

import {
  selectAllTracks,
  deselectAllTracks,
} from '../actions/actions';
import SearchBar from './SearchBar';
import LabelView from './LabelView';
import PlaylistView from './PlaylistView';
import Modal from './Modal';

class TrackOperations extends Component {
  constructor(props) {
    super(props);
    this.state = {
      label: <LabelView />,
      playlist: <PlaylistView />,
      menu: null,
    }
  }
  handleClick(menuType) {
    this.setState({
      ...this.state.menu ? { menu: null } : { menu: menuType }
    });
  }
  render() {
    const { selectAllTracks, deselectAllTracks } = this.props;
    return (
      <Container>
        <Button onClick={() => selectAllTracks()}>V</Button>
        <Button onClick={() => deselectAllTracks()}>X</Button>
        <SearchBar />
        <Button onClick={() => this.handleClick('label')}>Add/Remove Labels</Button>
        <Button onClick={() => this.handleClick('playlist')}>Add/Remove Playlists</Button>
        {this.state.menu ? (
          <Modal onClick={() => this.handleClick()}>
            {this.state[this.state.menu]}
          </Modal>
        ) : null}
      </Container>
    );
  }
}

const mapStateToProps = state => ({

});

export default connect(mapStateToProps, {
  selectAllTracks, deselectAllTracks,
})(TrackOperations);

const Button = styled.button`
  margin: 0 2px;
`;
const Container = styled.div`
  display: flex;
  margin-bottom: 6px;
`;