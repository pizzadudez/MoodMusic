import React, { memo } from 'react';
import styled from 'styled-components';

import Paper from '@material-ui/core/paper';

export default memo(({ children }) => (
  <Column>
    {React.Children.map(children || null, (child, idx) => (
      <StyledPaper key={idx}>{child}</StyledPaper>
    ))}
  </Column>
));

const Column = styled.div`
  min-height: 0; /* Important */
  display: flex;
  flex-direction: column;
  margin-top: 8px;
`;

const StyledPaper = styled(Paper)`
  min-height: 120px;
  margin-bottom: 8px;
  padding: 8px;
  background-color: #272727;
  color: #ceded1;
`;
