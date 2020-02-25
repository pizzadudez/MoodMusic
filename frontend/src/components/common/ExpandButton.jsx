import React, { memo } from 'react';
import styled from 'styled-components';

import Button from '@material-ui/core/Button';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

export default memo(({ className, onClick, expanded }) => (
  <StyledButton className={className} onClick={onClick} expanded={expanded}>
    <ExpandMoreIcon />
  </StyledButton>
));

const _StyledButton = ({ expanded, ...rest }) => <Button {...rest} />;
const StyledButton = styled(_StyledButton)`
  color: #fff;
  min-width: 0;
  height: 36px;
  width: 36px;
  border-radius: 50%;
  padding: 6px;
  &:hover {
    background-color: #4848485c;
  }
  &.MuiButton-contained {
    background-color: transparent;
    box-shadow: none;
    border-radius: 50%;
  }
  &.MuiButton-contained {
  }
  .MuiButton-label .MuiSvgIcon-root {
    transform: ${props => 'rotate(' + (props.expanded ? 90 : 270) + 'deg)'};
    transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1) 0ms;
  }
`;
