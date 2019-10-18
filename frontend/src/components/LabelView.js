import React, { Component } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';

import { addOrRemoveLabels, postChanges, modifyLabelSelection } from '../actions/actions';
import LabelButton from './LabelButton';

class LabelView extends Component {
  handleChange = event => this.props.modifyLabelSelection(event.target.id)
  render() {
    const {
      labels,
      labelIds,
      addOrRemoveLabels,
      postChanges,
    } = this.props;
    return (
      <Container>
        <button onClick={() => addOrRemoveLabels()}>Add Labels</button>
        <button onClick={() => addOrRemoveLabels(false)}>Remove Labels</button>
        <button onClick={() => postChanges()}>Submit Changes</button>

        <p>Genres</p>
        {labelIds.genres.map(id => (
          <>
            <LabelButton
              key={id}
              label={labels[id]}
              checked={labelIds.selected[id] ? true : false}
              onChange={this.handleChange}
            >
              {labels[id].name}
            </LabelButton>
            {labelIds.subgenres[id]
              ? labelIds.subgenres[id].map(id => (
                <LabelButton
                  key={id}
                  label={labels[id]}
                  checked={labelIds.selected[id] ? true : false}
                  onChange={this.handleChange}
                >
                  {labels[id].name}
                </LabelButton>
              ))
              : null
            }
          </>
        ))}

        <p>Moods</p>
        {labelIds.moods.map(id => (
          <LabelButton
            key={id}
            label={labels[id]}
            checked={labelIds.selected[id] ? true : false}
            onChange={this.handleChange}
          >
            {labels[id].name}
          </LabelButton>
        ))}
      </Container>
    );
  }
}

const mapStateToProps = state => ({
  labels: state.labels,
  labelIds: state.labelIds,
});

export default connect(mapStateToProps, {
  addOrRemoveLabels, postChanges, modifyLabelSelection,
})(LabelView);

const Container = styled.div`
  grid-area: sidebar;
  width: 300px;
  height: 400px;
  background-color: palegoldenrod;
`;