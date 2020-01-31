import React, { memo } from 'react';
import { useSelector, useDispatch } from 'redux';
import { createSelector } from 'reselect';
import styled from 'styled-components';

export default memo(() => {

  return (
    <div>slide</div>
  );
});

const Container = styled.div`
  background-color: #333333;
  height: 30px;
  border-bottom: 1px solid #272727;
  padding: 4px 16px;
  display: grid;
  grid-template-columns:
    max-content
    15px
    minmax(180px, 2fr)
    minmax(120px, 1fr)
    minmax(70px, 1fr)
    minmax(20px, 30px)
    max-content
    minmax(30px, 3fr);
  align-items: center;
`;

const Section = styled.span`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  padding: 0 3px;
  color: #3fe479;
  font-size: 1.05em;
  text-shadow: 0.7px 0.9px #00000099;
`;

const LabelsSection = styled.div`
  display: flex;
  flex-direction: row;
`;