import React, { memo } from 'react';
import styled from 'styled-components';

import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';

export default memo(({ field, name, options, ...props }) => {
  return (
    <StyledRadioGroup {...field} {...props} name={name}>
      {options.map((option, idx) => (
        <FormControlLabel
          key={idx}
          value={option.type}
          control={<StyledRadio />}
          label={option.label}
        />
      ))}
    </StyledRadioGroup>
  );
});

const StyledRadioGroup = styled(RadioGroup)`
  display: grid;
  grid-template-columns: repeat(3, min-content);
  .MuiTypography-root.MuiFormControlLabel-label.MuiTypography-body1 {
    margin-left: -5px;
  }
  .MuiFormControlLabel-root {
    margin-right: 11px;
  }
`;
const StyledRadio = styled(Radio)`
  &.MuiRadio-colorSecondary {
    &.Mui-checked {
      color: #5dff5d;
    }
    &:hover {
      background-color: #5dff5d08;
    }
  }
`;
