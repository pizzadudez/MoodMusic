import React, { memo } from 'react';
import styled from 'styled-components';

import TextField from '@material-ui/core/TextField';

export default memo(({ label, ...rest }) => {
  return (
    <StyledTextField
      {...rest}
      label={label}
      variant="outlined"
      size="small"
      autoComplete="off"
    />
  );
});

const StyledTextField = styled(TextField)`
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
