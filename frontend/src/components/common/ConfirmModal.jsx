import React, { memo } from 'react';
import styled from 'styled-components';

import Dialog from '@material-ui/core/Dialog';
import Button from './Button';

export default memo(({ open, action, onClose }) => {
  return (
    <StyledDialog open={open} onClose={onClose}>
      <div>Confirmation Modal</div>
      <Button onClick={action} variant="submit">
        Confirm
      </Button>
      <Button onClick={onClose} variant="cancel">
        Cancel
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
