import React, { memo } from 'react';
import styled from 'styled-components';

import TextField from '@material-ui/core/TextField';

export default memo(({ className, label, onChange, ...props }) => (
  <StyledTextField
    className={className}
    label={label}
    onChange={onChange}
    variant="outlined"
    size="small"
    autoComplete="off"
    {...props}
  />
));

const StyledTextField = styled(TextField)`
  input {
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
`;
