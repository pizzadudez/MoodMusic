import React, { memo } from 'react';
import styled from 'styled-components';

import Container from '../components/common/Container';
import ContainerColumn from '../components/common/ContainerColumn';
import PlaylistManager from '../components/PlaylistManager';
import PlaylistForm from '../components/PlaylistForm';

export default memo(() => (
  <Content>
    <Container>
      <PlaylistManager />
    </Container>
    <ContainerColumn>
      <PlaylistForm />
    </ContainerColumn>
  </Content>
));

const Content = styled.div`
  min-height: 0;
  display: grid;
  grid-template-columns: minmax(780px, 880px) minmax(370px, 400px);
  column-gap: 10px;
  margin: 0 4px;
`;
