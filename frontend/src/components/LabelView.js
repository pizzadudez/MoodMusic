import React, { Component } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';

import { addLabels } from '../actions/actions';
import LabelButton from './LabelButton';

class LabelView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedLabelIds: {},
    }
  }
  handleChange(e) {
    this.setState({
      selectedLabelIds: {
        ...this.state.selectedLabelIds,
        [e.target.value]: e.target.checked,
      }
    });
  }
  render() {
    const { labelMap, labelIds, addLabels, trackIdsSelected } = this.props;
    return (
      <Container>
        <button 
          onClick={() => addLabels(trackIdsSelected, this.state.selectedLabelIds)}
        >
          Add Labels
        </button>
        {labelIds.map(id => (
          <LabelButton
            key={id}
            label={labelMap[id]}
            onChange={this.handleChange.bind(this)}
          >
            {labelMap[id].name}
          </LabelButton>
        ))}
      </Container>
    );
  }
}

const mapStateToProps = state => ({
  labelMap: state.labels.labelMap,
  labelIds: state.labels.labelIds,
  trackIdsSelected: state.tracks.trackIdsSelected,
});

export default connect(mapStateToProps, {
  addLabels,
})(LabelView);

const Container = styled.div`
  grid-area: sidebar;
  width: 300px;
  height: 400px;
  background-color: palegoldenrod;
`;