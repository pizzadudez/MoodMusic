import React, { memo } from 'react';
import styled from 'styled-components';

import Navbar from '../components/Navbar';
import Container from '../components/common/Container';
import TrackManager from '../components/TrackManager';

export default memo(() => {
  return (
    <PageContainer>
      <Navbar />
      <Content>
        <Container>
          <div>Sidebar1</div>
          <div>Sidebar2</div>
        </Container>
        <Container>
          <TrackManager />
        </Container>
      </Content>
    </PageContainer>
  );
});

const PageContainer = styled.div`
  display: grid;
  grid-template-rows: 50px minmax(500px, calc(100vh - 66px));
  grid-row-gap: 6px;
  max-height: 100vh;
  overflow: hidden;
`;
const Content = styled.div`
  display: grid;
  grid-template-columns: minmax(300px, 360px) minmax(70%, 65%);
  grid-column-gap: 10px;
  margin: 0 4px;
`;
