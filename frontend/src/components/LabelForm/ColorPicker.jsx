import React, { memo, useState, useCallback } from 'react';
import styled from 'styled-components';
import { SketchPicker } from 'react-color';
import { useField } from 'formik';

export default memo(props => {
  const [field, meta, helpers] = useField(props.name);
  const { value } = meta;
  const { setValue } = helpers;

  const changeColor = useCallback(
    (color, e) => {
      setValue(color.hex);
    },
    [setValue]
  );

  return <StyledPicker color={value} onChange={changeColor} />;
});

const StyledPicker = styled(SketchPicker)`
  &[style] {
    background: #272727 !important;
    span {
      color: white !important;
    }
  }
`;
