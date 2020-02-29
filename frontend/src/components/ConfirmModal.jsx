import React, { memo, useCallback } from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { createSelector } from 'reselect';

import { confirmAction, cancelAction } from '../actions/appActions';
import Dialog from '@material-ui/core/Dialog';
import Button from './common/Button';

const stateSelector = createSelector(
  state => state.app.confirmation,
  ({ pending, title, description }) => ({ pending, title, description })
);

export default memo(({}) => {
  const dispatch = useDispatch();
  const { pending, title, description } = useSelector(stateSelector);

  const confirm = useCallback(() => dispatch(confirmAction()), []);
  const cancel = useCallback(() => dispatch(cancelAction()), []);

  return (
    <StyledDialog open={pending}>
      <div>{title}</div>
      <div>{description}</div>
      <Button onClick={cancel} variant="cancel">
        Cancel
      </Button>
      <Button onClick={confirm} variant="submit">
        Confirm
      </Button>
    </StyledDialog>
  );
});

const StyledDialog = styled(Dialog)`
  .MuiPaper-root {
    background-color: #1f1f1f;
    border-radius: 4px;
    min-width: 600px;
    min-height: 300px;
    padding: 8px 10px;
    color: white;
  }
  .MuiDialog-container {
    margin-top: -200px;
  }
`;
