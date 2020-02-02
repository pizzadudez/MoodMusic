import React, { memo } from 'react';
import styled from 'styled-components';

import Paper from '@material-ui/core/paper';

export default memo(({ children }) => (
  <Container>
    {React.Children.map(children || null, (child, idx) => (
      <StyledPaper>{child}</StyledPaper>
    ))}
  </Container>
));

const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

const StyledPaper = styled(Paper)`
  background-color: #444;
  min-height: 400px;
  padding: 8px;
  margin-bottom: 10px;
`;
