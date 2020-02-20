import React, { memo } from 'react';
import styled from 'styled-components';

import Chip from '@material-ui/core/Chip';

export default memo(({ color, name }) => <Label label={name} color={color} />);

const _Label = ({ color, name, ...rest }) => <Chip {...rest} />;
const Label = styled(_Label)`
  height: 38px;
  background-color: #272727;
  border: 0.8px solid #171717;
  border-radius: ${props => (props.color ? 12 : 3)}px;
  margin: 0 1px;
  box-shadow: 0px 3px 1px -2px rgba(0, 0, 0, 0.2),
    0px 2px 2px 0px rgba(0, 0, 0, 0.14),
    inset 0 0 12px 0
      ${props => (props.color ? props.color + 'a3' : '#b5b5b55c')};
  color: white;
  text-shadow: 1px 1px 0.5px #000000d4;
  cursor: pointer;
  span {
    padding: 0;
  }
`;
