import React from 'react';
import styled from 'styled-components';

export default ({ text, onClick}) => {
  return (
    <Button>
      <span>{text}</span>
    </Button>
  );
}

const Button = styled.button`
  height: 36px;
`;