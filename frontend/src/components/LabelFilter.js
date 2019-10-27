import React, { Component } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';

import {
  filterByLabel,
  deselectAllLabelFilters,
} from '../actions/filterActions';
import LabelFilterButton from './LabelFilterButton';

class LabelFilter extends Component {
  handleClick = event => this.props.filterByLabel(event.target.value)
  render() {
    const { loadingFinished, labels, filters, 
      deselectAllLabelFilters } = this.props;
    if (!loadingFinished) return <Container>Loading</Container>;
    
    return (
      <Container>
        <button onClick={() => deselectAllLabelFilters()}>Deselect</button>
        <p>Genres</p>
        {labels.genres.map(id => (
          <React.Fragment key={id}>
            <LabelFilterButton
              key={id}
              label={labels.map[id]}
              filter={filters[id]}
              onClick={this.handleClick}
            >
              {labels.map[id].name}
            </LabelFilterButton>
            {labels.subgenres[id]
              ? labels.subgenres[id].map(id => (
                <LabelFilterButton
                  key={id}
                  label={labels.map[id]}
                  filter={filters[id]}
                  onClick={this.handleClick}
                >
                  {labels.map[id].name}
                </LabelFilterButton>
              ))
              : null
            }
          </React.Fragment>
        ))}
        <p>Moods</p>
        {labels.moods.map(id => (
          <LabelFilterButton
            key={id}
            label={labels.map[id]}
            filter={filters[id]}
            onClick={this.handleClick}
          >
            {labels.map[id].name}
          </LabelFilterButton>
        ))}
      </Container>
    )
  }
}

const mapStateToProps = state => ({
  loadingFinished: state.app.loadingFinished,
  labels: state.labels,
  filters: state.filter.labels,
});

export default connect(mapStateToProps, {
  filterByLabel, deselectAllLabelFilters,
})(LabelFilter);

const Container = styled.div`
  height: 300px;
  background-color: #292929;
  color: #bdbdbd;
  margin-top: 10px;
`;