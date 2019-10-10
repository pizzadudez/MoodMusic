import React from 'react';
import styled from 'styled-components';

import Navbar from './Navbar';

const Grid = styled.div`
  display: grid;
  grid-template-columns: 230px auto;
  grid-template-rows: 70px auto;
  grid-template-areas:
  'navbar navbar'
  'sidebar content';
`;

export default ({ Sidebar, Content }) => {
  return (
    <Grid>
      <Navbar />
      {Sidebar}
      {Content}
    </Grid>
  );
}




