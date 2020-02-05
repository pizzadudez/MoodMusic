import React, { memo } from 'react';
import styled from 'styled-components';

import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';

export default memo(({ label, options, ...rest }) => {
  return (
    <StyledTextField
      {...rest}
      select
      variant="outlined"
      size="small"
      label={label}
    >
      {options.map(option => (
        <MenuItem key={option.id} value={option.id}>
          {option.name}
        </MenuItem>
      ))}
    </StyledTextField>
  );
});

const StyledTextField = styled(TextField)`
  /* width: 100%; */
  .MuiInputBase-root {
    color: white;
  }
  label {
    color: grey;
    &.MuiInputLabel-shrink {
      color: white;
    }
  }
  .MuiOutlinedInput-root {
    fieldset {
      border-color: grey;
    }
    &:hover fieldset {
      border-color: lightgray;
    }
    &.Mui-focused fieldset {
      border-color: lightgray;
    }
  }
  input {
    color: white;
  }
`;
