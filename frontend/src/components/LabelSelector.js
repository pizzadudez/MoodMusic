import React, { Component } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';

import {
  addOrRemoveLabels,
  postChanges,
  modifyLabelSelection
} from '../actions/actions';
import LabelSelectorButton from './LabelSelectorButton';

class LabelSelector extends Component {
  handleChange = event => this.props.modifyLabelSelection(event.target.value)
  render() {
    const { labels, addOrRemoveLabels, postChanges, loadingFinished } = this.props;

    if (!loadingFinished) return <Container>Loading</Container>;
    return (
      <Container>
        <p>Genres</p>
        {labels.genres.map(id => (
          <React.Fragment key={id}>
            <LabelSelectorButton
              key={id}
              label={labels.map[id]}
              checked={labels.selected[id] ? true : false}
              onChange={this.handleChange}
            >
              {labels.map[id].name}
            </LabelSelectorButton>
            {labels.subgenres[id]
              ? labels.subgenres[id].map(id => (
                <LabelSelectorButton
                  key={id}
                  label={labels.map[id]}
                  checked={labels.selected[id] ? true : false}
                  onChange={this.handleChange}
                >
                  {labels.map[id].name}
                </LabelSelectorButton>
              ))
              : null
            }
          </React.Fragment>
        ))}

        <p>Moods</p>
        {labels.moods.map(id => (
          <LabelSelectorButton
            key={id}
            label={labels.map[id]}
            checked={labels.selected[id] ? true : false}
            onChange={this.handleChange}
          >
            {labels.map[id].name}
          </LabelSelectorButton>
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
  loadingFinished: state.app.loadingFinished,
});

export default connect(mapStateToProps, {
  addOrRemoveLabels, postChanges, modifyLabelSelection,
})(LabelSelector);

const Container = styled.div`
  width: 300px;
  height: 400px;
  background-color: #292929;
  z-index: 3;
  color: #bdbdbd;
`;