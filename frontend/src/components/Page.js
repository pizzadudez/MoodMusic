import React from 'react';
import styled from 'styled-components';

import Navbar from './Navbar';

export default ({ Sidebar, Content }) => {
  return (
    <Grid>
      <Navbar />
      <SidebarWrapper>{Sidebar}</SidebarWrapper>
      {Content}
    </Grid>
  );
}

const Grid = styled.div`
  display: grid;
  grid-template-columns: 300px auto;
  grid-template-rows: 70px auto;
  grid-template-areas:
  'navbar navbar'
  'sidebar content';
`;
const SidebarWrapper = styled.div`
  grid-area: sidebar;
`;




