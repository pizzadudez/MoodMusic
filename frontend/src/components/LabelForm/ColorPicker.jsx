import React, { memo, useState, useCallback } from 'react';
import { SketchPicker } from 'react-color';
import styled from 'styled-components';

export default memo(({ name, value, setFieldValue }) => {
  const [isOpen, setIsOpen] = useState();

  const togglePicker = useCallback(() => {
    setIsOpen(isOpen => !isOpen);
  }, [setIsOpen]);

  const changeColor = useCallback(
    (color, e) => {
      setFieldValue(name, color.hex);
    },
    [setFieldValue]
  );

  return (
    <div>
      <ColorButton type="button" color={value} onClick={togglePicker}>
        Pick Color
      </ColorButton>
      {isOpen && <SketchPicker color={value} onChange={changeColor} />}
    </div>
  );
});

const ColorButton = styled.button`
  width: 100px;
  height: 40px;
  color: black;
  background-color: ${props => (props.color ? props.color : '#fff')};
  text-align: center;
  line-height: 40px;
  border-radius: 3px;
  cursor: pointer;
  border: none;
  &:focus {
    outline: none;
  }
`;
