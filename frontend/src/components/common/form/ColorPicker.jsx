import React, { memo, useCallback } from 'react';
import styled from 'styled-components';
import { SketchPicker } from 'react-color';
import { useField } from 'formik';

export default memo(props => {
  const [_, meta, helpers] = useField(props.name);
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
    box-shadow: 0px 3px 1px -2px rgba(0, 0, 0, 0.2),
      0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12);
    span {
      color: white !important;
    }
  }
`;
