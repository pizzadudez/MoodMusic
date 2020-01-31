import React, { memo } from 'react';
import styled from 'styled-components';
import Switch from '@material-ui/core/Switch';

export default memo(({
  checked,
  onChange
}) => {

  return (
    <StyledSwitch
      checked={checked}
      onChange={onChange}
    />
  );
});

const StyledSwitch = styled(Switch)`
  & .MuiSwitch-colorSecondary.Mui-checked {
    color: #fafafa;
  }
  & .MuiSwitch-colorSecondary.Mui-checked + .MuiSwitch-track {
    background-color: #04ff00;
  }
`;