import React from 'react';
import styled from 'styled-components';

export default ({ text, onClick, highlight}) => {
  return (
    <Button
      onClick={onClick}
      highlight={highlight}
    >
      <span>{text}</span>
    </Button>
  );
}

const Button = styled.button`
  ${props => props.highlight ? 'background-color: yellow' : ''};
  height: 36px;
  cursor: pointer;
`;