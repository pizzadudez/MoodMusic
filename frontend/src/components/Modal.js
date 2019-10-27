import React, { Component } from 'react';
import styled from 'styled-components';

export default class Modal extends Component {
  render() {
    const { onClick, children} = this.props;
    return (
      <Background>
        <Container>
          <button onClick={onClick}>X</button>
          {children}
        </Container>
      </Background>
    );
  }
}

const Background = styled.div`
  position: fixed;
  z-index: 100;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: #00000085;
`;
const Container = styled.div`
  position: absolute;
  z-index: 101;
  top: 50%;
  left: 50%;
  background-color: grey;
  transform: translate(-50%, -50%);
`;