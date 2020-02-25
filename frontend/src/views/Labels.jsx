import React, { memo } from 'react';
import styled from 'styled-components';

import Container from '../components/common/Container';
import ContainerColumn from '../components/common/ContainerColumn';
import LabelManager from '../components/LabelManager';

export default memo(() => {
  return (
    <Content>
      <Container>
        <LabelManager />
      </Container>
    </Content>
  );
});

const Content = styled.div`
  min-height: 0;
  display: grid;
  grid-template-columns: 90%;
  column-gap: 10px;
  margin: 0 4px;
`;
