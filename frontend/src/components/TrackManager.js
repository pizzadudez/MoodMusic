import React, { Component } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';

class TrackManager extends Component {
  render() {
    return (
      <Container>

      </Container>
    );
  }
}

const mapStateToProps = state => ({

});

export default connect(mapStateToProps, {

})(TrackManager);

const Container = styled.div`
  height: 400px;
  width: 800px;
`;