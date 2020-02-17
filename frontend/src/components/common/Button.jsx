import React, { memo } from 'react';
import styled from 'styled-components';
import Button from '@material-ui/core/Button';

export default memo(({ onClick, highlight, children, disabled }) => (
  <StyledButton
    onClick={onClick}
    highlight={highlight}
    variant="contained"
    disabled={disabled}
  >
    {children}
  </StyledButton>
));

const StyledButton = styled(Button)`
  color: #000;
  margin: 0 4px;
  font-size: 1em;
  letter-spacing: normal;
  text-transform: none;
  &.MuiButton-contained {
    background-color: ${props => (props.highlight ? '#94ff5d' : '#5dff5d')};
  }
  &.MuiButton-contained:hover {
    background-color: ${props => (props.highlight ? '#67e824' : '#34d434')};
  }
`;
