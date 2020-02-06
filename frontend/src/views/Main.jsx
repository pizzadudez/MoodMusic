import React, { memo } from 'react';
import styled from 'styled-components';

import ContainerColumn from '../components/common/ContainerColumn';
import Container from '../components/common/Container';
import TrackManager from '../components/TrackManager';
import PlaylistFilter from '../components/PlaylistFilter';
import LabelFilter from '../components/LabelFilter';

export default memo(() => {
  return (
    <Content>
      <ContainerColumn>
        <PlaylistFilter />
        <LabelFilter />
      </ContainerColumn>
      <Container>
        <TrackManager />
      </Container>
    </Content>
  );
});

const Content = styled.div`
  min-height: 0;
  display: grid;
  grid-template-columns: minmax(300px, 360px) minmax(70%, 65%);
  grid-column-gap: 10px;
  margin: 0 4px;
`;
