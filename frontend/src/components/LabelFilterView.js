import React, { Component } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';

import { filterByLabel } from '../actions/filterActions';
import LabelFilter from './LabelFilter';

class LabelFilterView extends Component {
  handleClick = event => this.props.filterByLabel(event.target.value)
  render() {
    const { loadingFinished, labels } = this.props;

    if (!loadingFinished) return <Container>Loading</Container>;
    return (
      <Container>
        <p>Genres</p>
        {labels.genres.map(id => (
          <React.Fragment key={id}>
            <LabelFilter
              key={id}
              label={labels.map[id]}
              filter={labels.filter[id]}
              onClick={this.handleClick}
            >
              {labels.map[id].name}
            </LabelFilter>
            {labels.subgenres[id]
              ? labels.subgenres[id].map(id => (
                <LabelFilter
                  key={id}
                  label={labels.map[id]}
                  filter={labels.filter[id]}
                  onClick={this.handleClick}
                >
                  {labels.map[id].name}
                </LabelFilter>
              ))
              : null
            }
          </React.Fragment>
        ))}
        <p>Moods</p>
        {labels.moods.map(id => (
          <LabelFilter
            key={id}
            label={labels.map[id]}
            filter={labels.filter[id]}
            onClick={this.handleClick}
          >
            {labels.map[id].name}
          </LabelFilter>
        ))}
      </Container>
    )
  }
}

const mapStateToProps = state => ({
  loadingFinished: state.changes.loadingFinished,
  labels: state.labels,
});

export default connect(mapStateToProps, {
  filterByLabel,
})(LabelFilterView);

const Container = styled.div`
  height: 300px;
  background-color: #292929;
  color: #bdbdbd;
  margin-top: 10px;
`;