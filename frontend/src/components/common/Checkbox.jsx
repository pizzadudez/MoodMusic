import React, { memo } from 'react';
import styled from 'styled-components';

import Checkbox from '@material-ui/core/Checkbox';

export default memo(({ checked, value, onChange }) => {
  return <StyledCheckbox checked={checked} value={value} onChange={onChange} />;
});

const StyledCheckbox = styled(Checkbox)`
  &.MuiCheckbox-root {
    color: rgba(115, 115, 115, 0.45);
  }
  &.MuiCheckbox-colorSecondary.Mui-checked {
    color: rgb(97, 228, 97);
  }
  &.MuiIconButton-colorSecondary:hover {
    background-color: rgba(117, 255, 117, 0.04);
  }
`;
