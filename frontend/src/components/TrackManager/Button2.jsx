import React, { memo, useCallback, useState } from 'react';
import styled, { css } from 'styled-components';

import Button from '@material-ui/core/Button';
import RemoveCircleIcon from '@material-ui/icons/RemoveCircle';
import AddCircleIcon from '@material-ui/icons/AddCircle';

export default memo(({ itemId, color, add, remove, children }) => {
  console.log('>ModalBtn');
  const [selected, setSelected] = useState(false);
  const onClick = useCallback(() => {
    setSelected(selected => {
      if (selected === 'add') {
        add(itemId, false);
        return false;
      } else if (selected === 'remove') {
        add(itemId);
        remove(itemId, false);
      } else {
        add(itemId);
      }
      return 'add';
    });
  }, [setSelected, add, remove, itemId]);
  const onContextMenu = useCallback(
    e => {
      e.preventDefault();
      setSelected(selected => {
        if (selected === 'remove') {
          remove(itemId, false);
          return false;
        } else if (selected === 'add') {
          remove(itemId);
          add(itemId, false);
        } else {
          remove(itemId);
        }
        return 'remove';
      });
    },
    [setSelected, add, remove, itemId]
  );

  return (
    <StyledButton
      variant="contained"
      onClick={onClick}
      onContextMenu={onContextMenu}
      color={color}
      selected={selected}
    >
      {selected &&
        (selected === 'add' ? (
          <AddCircleIcon style={{ color: '#57ff57' }} />
        ) : (
          <RemoveCircleIcon style={{ color: '#ff4646' }} />
        ))}
      {children}
    </StyledButton>
  );
});

const _StyledButton = ({ selected, color, ...rest }) => <Button {...rest} />;
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
