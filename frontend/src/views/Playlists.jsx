import React, { memo } from 'react';
import styled from 'styled-components';

import Container from '../components/common/Container';
import ContainerColumn from '../components/common/ContainerColumn';
import PlaylistManager from '../components/PlaylistManager';

export default memo(() => (
  <Content>
    <Container>
      <PlaylistManager />
    </Container>
    <ContainerColumn>hello</ContainerColumn>
  </Content>
));

const Content = styled.div`
  min-height: 0;
  display: grid;
  grid-template-columns: minmax(850px, 1000px) minmax(400px, 440px);
  column-gap: 10px;
  margin: 0 4px;
`;
