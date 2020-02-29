import React, { memo, forwardRef } from 'react';
import styled from 'styled-components';

import Button from '@material-ui/core/Button';
import Tooltip from './Tooltip';
/*
import HistoryIcon from '@material-ui/icons/History';
import LibraryMusicIcon from '@material-ui/icons/LibraryMusic';
import ListIcon from '@material-ui/icons/List';
import LoopIcon from '@material-ui/icons/Loop';
import NotInterestedIcon from '@material-ui/icons/NotInterested';
import QueueMusicIcon from '@material-ui/icons/QueueMusic';
import RefreshIcon from '@material-ui/icons/Refresh';
import RotateLeftIcon from '@material-ui/icons/RotateLeft';
import RotateRightIcon from '@material-ui/icons/RotateRight';
import SettingsIcon from '@material-ui/icons/Settings';
import ShuffleIcon from '@material-ui/icons/Shuffle';
import UpdateIcon from '@material-ui/icons/Update';
*/

export default memo(({ onClick, children, tooltip, ...props }) => {
  const button = (
    <StyledButton onClick={onClick} iconOnly={!children} {...props}>
      {children || ''}
    </StyledButton>
  );
  const withTooltip = (
    <Tooltip title={tooltip} aria-label={tooltip} placement="bottom">
      {button}
    </Tooltip>
  );
  return tooltip ? (props.disabled ? button : withTooltip) : button;
});

const StyledButton = styled(
  forwardRef(({ variant, iconOnly, size, tooltip, ...props }, ref) => (
    <Button variant="contained" {...props} ref={ref} />
  ))
)`
  border-radius: 5px;
  padding: 3px 13px;
  font-size: 1.2rem;
  text-transform: none;
  letter-spacing: normal;
  &.MuiButton-contained {
    background-color: ${props => {
      switch (props.variant) {
        case 'open':
          return '#efad3f';
        case 'special':
          return '#a4ca52';
        case 'submit':
          return '#55f155a8';
        case 'cancel':
          return '#fb785fa8';
        case 'danger':
          return '#d23f3f';
        default:
          return '#00ce74';
      }
    }};
    :hover {
      background-color: ${props => {
        switch (props.variant) {
          case 'open':
            return '#ffbf55';
          case 'special':
            return '#b7de64';
          case 'submit':
            return '#55f155ed';
          case 'cancel':
            return '#fb785fed';
          case 'danger':
            return '#e44c4c';
          default:
            return '#01fb8e';
        }
      }};
    }
  }
  &.MuiButton-contained.Mui-disabled {
    color: rgba(216, 216, 216, 0.67);
    box-shadow: 0px 3px 1px -2px rgba(0, 0, 0, 0.05),
      0px 2px 2px 0px rgba(0, 0, 0, 0.05), 0px 1px 5px 0px rgba(0, 0, 0, 0.03);
    background-color: ${props => {
      switch (props.variant) {
        case 'open':
          return '#ffbf5587';
        case 'special':
          return '#b7de6487';
        case 'submit':
          return '#55f155ed';
        case 'cancel':
          return '#fb785fed';
        case 'danger':
          return '#e44c4c87';
        default:
          return '#01fb8e87';
      }
    }};
  }
  .MuiButton-label {
    white-space: nowrap;
  }
  ${props => {
    if (props.iconOnly) {
      return `
      padding: 3px 3px;
      min-width: 24px;
      border-radius: 10px;
      .MuiButton-startIcon {
        margin: 0;
      }
      .MuiButton-iconSizeMedium > *:first-child {
        ${props.size !== 'small' ? 'width: 2.1rem; height: 2.1rem;' : ''}
      }
      `;
    }
  }}
`;
