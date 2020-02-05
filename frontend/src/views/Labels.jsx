import React, { memo } from 'react';
import styled from 'styled-components';

import Navbar from '../components/Navbar';
import Container from '../components/common/Container';
import LabelManager from '../components/LabelManager';
import LabelForm from '../components/LabelForm';

export default memo(() => {
  return (
    <PageContainer>
      <Navbar />
      <Content>
        <Container>
          <LabelForm />
        </Container>
        <Container>
          <LabelManager />
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
  grid-template-columns: minmax(370px, 430px) minmax(65%, 60%);
  grid-column-gap: 10px;
  margin: 0 4px;
`;
