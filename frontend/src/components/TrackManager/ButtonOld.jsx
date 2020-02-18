import React, { memo, useCallback, useState } from 'react';
import styled from 'styled-components';

import Button from '@material-ui/core/Button';

export default memo(({ id, color, select, original, children }) => {
  const [selected, setSelected] = useState(false);
  const click = useCallback(() => {
    select(id);
    setSelected(selected => !selected);
  }, [id, select]);

  return (
    <StyledButton
      variant="contained"
      onClick={click}
      color={color}
      original={original ? 1 : 0} // fix styled-components, react-router confict
      selected={selected}
    >
      {children}
    </StyledButton>
  );
});

const StyledButton = styled(Button)`
  margin: 2px 3px;
  letter-spacing: normal;
  text-transform: none;
  &.MuiButtonBase-root .MuiButton-label {
    color: white;
    text-shadow: 1px 1px 1px #000000d4;
  }
  &.MuiButtonBase-root {
    background-color: ${props => (props.color ? props.color : '#e112ff')};
    border: 1px solid
      ${props => {
        if (props.selected) {
          return props.original ? '#ff4141' : '#4aff76';
        }
      }};
    box-shadow: ${props => {
      if (props.selected) {
        return (
          `0px 3px 1px -2px rgba(0,0,0,0.2),
          0px 2px 2px 0px rgba(0,0,0,0.14),
          inset -1px -1px 10px 2px rgba(0, 0, 0, 0.41),
          0px 1px 8px 0px  ` + (props.original ? '#d23333' : '#3fe479')
        );
      } else {
        return 'none';
      }
    }};
  }
`;
