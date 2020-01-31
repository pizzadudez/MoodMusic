import React, { memo } from 'react';
import styled from 'styled-components';

import Navbar from '../components/Navbar';

export default memo(() => {
  return (
    <PageContainer>
      <Navbar />
      <Content>
        <div style={{background: 'green', height: '100%'}}>
          <div style={{minHeight: '500px'}}>lol</div>
        </div>
        <div>Content</div>
      </Content>
    </PageContainer>
  );
});

const PageContainer = styled.div`
  display: grid;
  grid-template-rows: 50px 1fr;
  grid-row-gap: 6px;
`;
const Content = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr;
  grid-column-gap: 10px;
  height: 100%;
`;
