import React, { Component } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';

import {
  modifyTrackLabels,
} from '../actions/trackActions';
import SelectorButton from './SelectorButton';

class LabelSelector extends Component {
  constructor(props) {
    super(props);
    this.state = {
      toAdd: {},
      toRemove: {},
      adding: true,
    };
  }
  handleSelect = event => {
    const id = event.target.value;
    const { adding, toAdd, toRemove } = this.state;
    if (adding) {
      toRemove[id] = false;
      toAdd[id] = !toAdd[id];
    } else {
      toAdd[id] = false;
      toRemove[id] = !toRemove[id];
    }
    this.setState({ toAdd, toRemove });
  }
  handleSwitch = () => this.setState({ adding: !this.state.adding })
  handleUpdate = () => {
    const { toAdd, toRemove } = this.state;
    this.props.modifyTrackLabels({ toAdd, toRemove });
  }
  render() {
    const { labels, loadingFinished } = this.props;
    const { toAdd, toRemove } = this.state;
    if (!loadingFinished) return <Container>Loading</Container>;
    
    return (
      <Container>
        <p>Genres</p>
        {labels.genres.map(id => (
          <React.Fragment key={id}>
            <SelectorButton
              key={id}
              id={id}
              name={labels.map[id].name}
              color={labels.map[id].color}
              checked={(toAdd[id] || toRemove[id]) ? true : false}
              adding={toAdd[id]}
              onChange={this.handleSelect}
            />
            {labels.subgenres[id]
              ? labels.subgenres[id].map(id => (
                <SelectorButton
                  key={id}
                  id={id}
                  name={labels.map[id].name}
                  color={labels.map[id].color}
                  checked={(toAdd[id] || toRemove[id]) ? true : false}
                  adding={toAdd[id]}
                  onChange={this.handleSelect}
                />
              ))
              : null
            }
          </React.Fragment>
        ))}

        <p>Moods</p>
        {labels.moods.map(id => (
          <SelectorButton
            key={id}
            id={id}
            name={labels.map[id].name}
            color={labels.map[id].color}
            checked={(toAdd[id] || toRemove[id]) ? true : false}
            adding={toAdd[id]}
            onChange={this.handleSelect}
          />
        ))}
        <button onClick={this.handleSwitch}
          style={{backgroundColor: this.state.adding ? 'green' : 'red'}}
        >Add/Remove</button>
        <button onClick={this.handleUpdate}>Done</button>
      </Container>
    );
  }
}

const mapStateToProps = state => ({
  labels: state.labels,
  loadingFinished: state.app.loadingFinished,
});

export default connect(mapStateToProps, {
  modifyTrackLabels,
})(LabelSelector);

const Container = styled.div`
  width: 300px;
  height: 400px;
  background-color: #292929;
  z-index: 3;
  color: #bdbdbd;
`;