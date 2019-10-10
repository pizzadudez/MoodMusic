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
  background-color: lightcoral;
  border: 1px solid black;
  padding: 3px;
  margin: 0 1px;
  display: flex;
`;

const Text = styled.span`
  color: black;
  font-size: 0.7em;
  margin: auto;
`;