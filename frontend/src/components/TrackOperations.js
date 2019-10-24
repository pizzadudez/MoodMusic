import React, { Component } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';

import {
  selectAllTracks,
  deselectAllTracks,
} from '../actions/actions';
import SearchBar from './SearchBar';
import LabelView from './LabelView';

class TrackOperations extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showLabelMenu: false,
    }
  }
  handleLabelMenu = () => 
    this.setState({ showLabelMenu: ! this.state.showLabelMenu })
  render() {
    const { selectAllTracks, deselectAllTracks } = this.props;

    return (
      <Container>
        <Button onClick={() => selectAllTracks()}>V</Button>
        <Button onClick={() => deselectAllTracks()}>X</Button>
        <SearchBar />
        <div style={{position: 'relative'}}>
          <Button onClick={this.handleLabelMenu}>Add / Remove Labels</Button>
          {this.state.showLabelMenu ? (
            <LabelView />
          ) : null}
        </div>
        <Button>Add / Remove Tracks</Button>
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