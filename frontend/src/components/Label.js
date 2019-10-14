import React from 'react';
import styled from 'styled-components';

export default (props) => {
  return (
    <Label>
      <Text>{props.label.name}</Text>
    </Label>
  );
};

const Label = styled.div`
  height: 14px;
  max-width: 50px;
  background-color: #be5dda;
  padding: 3px;
  margin: 0 1px;
  display: flex;
  overflow: hidden;
  border-radius: 4px;
  box-shadow: 0 2px 2px 0 rgba(0,0,0,0.4), 
    0 3px 1px -2px rgba(0,0,0,0.12),
    0 1px 5px 0 rgba(0,0,0,0.2);
`;

const Text = styled.span`
  color: black;
  font-size: 0.7em;
  margin: auto;
`;