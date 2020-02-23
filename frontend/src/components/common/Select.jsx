import React, { memo } from 'react';
import styled from 'styled-components';

import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import { useField } from 'formik';

export default memo(({ label, options, ...props }) => {
  const [field, meta] = useField(props);
  const errorText = meta.error && meta.touched ? meta.error : '';

  return (
    <StyledTextField
      {...props}
      helperText={errorText}
      error={!!errorText}
      select
      variant="outlined"
      size="small"
      label={label}
      fullWidth
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
  min-width: 200px;
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
