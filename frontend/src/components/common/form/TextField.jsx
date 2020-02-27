import React, { memo } from 'react';
import styled from 'styled-components';

import TextField from '@material-ui/core/TextField';
import { useField } from 'formik';

export default memo(({ className, label, ...props }) => {
  const [_, meta] = useField(props);
  const errorText = meta.error && meta.touched ? meta.error : '';

  return (
    <StyledTextField
      fullWidth
      className={className}
      label={label}
      helperText={errorText}
      error={!!errorText}
      variant="outlined"
      size="small"
      autoComplete="off"
      {...props}
    />
  );
});

const StyledTextField = styled(TextField)`
  margin-top: 10px;
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
  .MuiFormHelperText-contained {
    margin: 4px 0 0;
    display: flex;
    justify-content: flex-end;
  }
  .MuiInputBase-input {
    height: auto;
  }
`;
