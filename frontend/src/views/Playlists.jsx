import React, { memo } from 'react';
import styled from 'styled-components';

import ContainerColumn from '../components/common/ContainerColumn';

export default memo(() => (
  <Content>
    <ContainerColumn>hello</ContainerColumn>
    <ContainerColumn>there</ContainerColumn>
  </Content>
));

const Content = styled.div`
  min-height: 0;
  display: grid;
  grid-template-columns: minmax(370px, 430px) minmax(700px, 60%);
  column-gap: 10px;
  margin: 0 4px;
`;
