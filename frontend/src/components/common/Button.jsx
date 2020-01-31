import React, { memo } from 'react';
import styled from 'styled-components';

export default memo(({
  text, onClick, highlight
}) => (
  <Button
    onClick={onClick}
    highlight
  >
    <span>{text}</span>
  </Button>
));

const Button = styled.button`
  ${props => props.highlight ? 'background-color: yellow' : ''};
  height: 36px;
  cursor: pointer;
`;