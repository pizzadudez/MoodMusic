import React, { memo, useCallback } from 'react';
import styled from 'styled-components';

import Button from '@material-ui/core/Button';
import RemoveCircleIcon from '@material-ui/icons/RemoveCircle';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';

export default memo(({ leftClick, rightClick, color, state, children }) => (
  <StyledButton
    onClick={leftClick}
    onContextMenu={rightClick}
    color={color}
    state={state}
  >
    {
      {
        add: <AddCircleIcon style={{ color: '#57ff57' }} />,
        remove: <RemoveCircleIcon style={{ color: '#ff4646' }} />,
        true: <CheckCircleIcon style={{ color: '#3ba5ff' }} />,
        false: undefined,
      }[state]
    }
    {children}
  </StyledButton>
));

const _StyledButton = ({ state, color, ...rest }) => (
  <Button variant="contained" {...rest} />
);
const StyledButton = styled(_StyledButton)`
  margin: 2px 3px;
  letter-spacing: normal;
  text-transform: none;
  &.MuiButtonBase-root .MuiButton-label {
    color: white;
    text-shadow: 1px 1px 0.5px #000000d4;
    svg {
      margin-right: 3px;
    }
  }
  &.MuiButtonBase-root {
    background-color: #272727;
    padding: 8px 12px;
    border: 0.8px solid #171717;
    border-radius: 3px;
    box-shadow: 0px 3px 1px -2px rgba(0, 0, 0, 0.2),
      0px 2px 2px 0px rgba(0, 0, 0, 0.14),
      inset 0 0 6px 0 ${props => props.color + 'a3' || '#00000029'};

    &.MuiButton-contained:hover {
      background-color: #444;
    }
  }
`;
