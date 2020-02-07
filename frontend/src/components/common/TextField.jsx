import React, { memo } from 'react';
import styled from 'styled-components';

import TextField from '@material-ui/core/TextField';
import { useField } from 'formik';

export default memo(({ label, ...props }) => {
  const [field, meta] = useField(props);
  const errorText = meta.error && meta.touched ? meta.error : '';

  return (
    <StyledTextField
      {...props}
      label={label}
      helperText={errorText}
      error={!!errorText}
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
