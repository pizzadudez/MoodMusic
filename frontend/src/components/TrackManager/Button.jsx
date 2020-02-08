import React, { memo, useCallback, useState } from 'react';
import styled from 'styled-components';

import Button from '@material-ui/core/Button';

export default memo(({ id, select, original, children }) => {
  const [selected, setSelected] = useState(false);
  const click = useCallback(() => {
    select(id);
    setSelected(selected => !selected);
  }, [id, select]);

  return (
    <StyledButton
      variant="contained"
      onClick={click}
      original={original ? 1 : 0} // fix styled-components, react-router confict
      selected={selected}
    >
      {children}
    </StyledButton>
  );
});

const StyledButton = styled(Button)`
  margin: 0 2px;
  letter-spacing: normal;
  text-transform: none;
  &.MuiButton-contained {
    background-color: ${props =>
      props.original
        ? props.selected
          ? 'red'
          : 'yellow'
        : props.selected
        ? 'green'
        : 'white'};
  }
`;
