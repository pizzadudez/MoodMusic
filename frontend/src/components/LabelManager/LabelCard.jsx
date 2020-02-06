import React, { memo } from 'react';
import styled from 'styled-components';

export default memo(({ label }) => {
  return (
    <Paper>
      <Test>{label.name}</Test>
    </Paper>
  );
});

const Paper = styled.div`
  background-color: #444;
  color: white;
  min-height: 80px;
  min-width: 80px;
  padding: 6px;
  margin: 4px;
  border-radius: 4px;
  box-shadow: 0px 2px 1px -1px rgba(0, 0, 0, 0.2),
    0px 1px 1px 0px rgba(0, 0, 0, 0.14), 0px 1px 3px 0px rgba(0, 0, 0, 0.12);
`;
const Test = styled.div`
  width: 300px;
  height: 250px;
`;
