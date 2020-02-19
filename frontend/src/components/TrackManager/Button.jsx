import React, { memo, useCallback, useState } from 'react';
import styled, { css } from 'styled-components';

import Button from '@material-ui/core/Button';
import RemoveCircleIcon from '@material-ui/icons/RemoveCircle';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';

export default memo(({ itemId, color, select, original, children }) => {
  console.log('>ModalBtn');
  const [selected, setSelected] = useState(false);
  const click = useCallback(() => {
    select(itemId);
    setSelected(selected => !selected);
  }, [select, setSelected, itemId]);

  return (
    <StyledButton
      variant="contained"
      onClick={click}
      color={color}
      original={original}
      selected={selected}
    >
      {selected &&
        (original ? (
          <RemoveCircleIcon style={{ color: '#ff4646' }} />
        ) : (
          <AddCircleIcon style={{ color: '#57ff57' }} />
        ))}
      {!selected && original && (
        <CheckCircleIcon style={{ color: '#3ba5ff' }} />
      )}
      {children}
    </StyledButton>
  );
});

const _StyledButton = ({ color, original, selected, ...rest }) => (
  <Button {...rest} />
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

// const StyledButton = styled(Button)`
//   margin: 2px 3px;
//   letter-spacing: normal;
//   text-transform: none;
//   &.MuiButtonBase-root .MuiButton-label {
//     color: white;
//     text-shadow: 1px 1px 0.5px ${props => props.color + 47 || '#000000d4'};
//   }
//   &.MuiButtonBase-root {
//     background-color: #444444;
//     border: 1.2px solid ${props => props.color + 80 || 'black'};
//     border-radius: 3px;
//     box-shadow:  0px 3px 1px -2px rgba(0,0,0,0.2),
//           0px 2px 2px 0px rgba(0,0,0,0.14),
//           inset -1px -1px 10px 2px rgba(0, 0, 0, 0.41);
//     /* box-shadow: ${props => {
//       if (props.selected) {
//         return (
//           `0px 3px 1px -2px rgba(0,0,0,0.2),
//           0px 2px 2px 0px rgba(0,0,0,0.14),
//           inset -1px -1px 10px 2px rgba(0, 0, 0, 0.41),
//           0px 1px 8px 0px  ` + (props.original ? '#d23333' : '#3fe479')
//         );
//       } else {
//         return 'none';
//       }
//     }}; */
//   }
// `;
