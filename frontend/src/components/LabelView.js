import React, { Component } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';

import {
  addOrRemoveLabels,
  postChanges,
  modifyLabelSelection
} from '../actions/actions';
import LabelButton from './LabelButton';

class LabelView extends Component {
  handleChange = event => this.props.modifyLabelSelection(event.target.value)
  render() {
    const { labels, addOrRemoveLabels, postChanges, loadingFinished } = this.props;

    if (!loadingFinished) return <Container>Loading</Container>;
    return (
      <Container>
        <p>Genres</p>
        {labels.genres.map(id => (
          <React.Fragment key={id}>
            <LabelButton
              key={id}
              label={labels.map[id]}
              checked={labels.selected[id] ? true : false}
              onChange={this.handleChange}
            >
              {labels.map[id].name}
            </LabelButton>
            {labels.subgenres[id]
              ? labels.subgenres[id].map(id => (
                <LabelButton
                  key={id}
                  label={labels.map[id]}
                  checked={labels.selected[id] ? true : false}
                  onChange={this.handleChange}
                >
                  {labels.map[id].name}
                </LabelButton>
              ))
              : null
            }
          </React.Fragment>
        ))}

        <p>Moods</p>
        {labels.moods.map(id => (
          <LabelButton
            key={id}
            label={labels.map[id]}
            checked={labels.selected[id] ? true : false}
            onChange={this.handleChange}
          >
            {labels.map[id].name}
          </LabelButton>
        ))}

        <button onClick={() => addOrRemoveLabels()}>Add Labels</button>
        <button onClick={() => addOrRemoveLabels(false)}>Remove Labels</button>
        <button onClick={() => postChanges()}>Submit Changes</button>
      </Container>
    );
  }
}

const mapStateToProps = state => ({
  labels: state.labels,
  loadingFinished: state.changes.loadingFinished,
});

export default connect(mapStateToProps, {
  addOrRemoveLabels, postChanges, modifyLabelSelection,
})(LabelView);

const Container = styled.div`
  width: 300px;
  height: 400px;
  background-color: #292929;
  z-index: 3;
  position: absolute;
  color: #bdbdbd;
`;