import React, { memo } from 'react';
import styled from 'styled-components';

import ContainerColumn from '../components/common/ContainerColumn';
import LabelManager from '../components/LabelManager';
import LabelForm from '../components/LabelForm';

export default memo(() => {
  return (
    <Content>
      <ContainerColumn>
        <LabelForm />
      </ContainerColumn>
      <ContainerColumn>
        <LabelManager />
      </ContainerColumn>
    </Content>
  );
});

const Content = styled.div`
  min-height: 0;
  display: grid;
  grid-template-columns: minmax(370px, 430px) minmax(700px, 60%);
  column-gap: 10px;
  margin: 0 4px;
`;
