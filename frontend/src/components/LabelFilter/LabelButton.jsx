import React, { memo, useCallback } from 'react';

import LabelButtonBase from '../common/LabelButtonBase';

export default memo(({ itemId, color, include, exclude, state, children }) => {
  const leftClick = useCallback(() => include(itemId), [include, itemId]);
  const rightClick = useCallback(
    e => {
      e.preventDefault();
      exclude(itemId);
    },
    [exclude, itemId]
  );
  return (
    <LabelButtonBase
      leftClick={leftClick}
      rightClick={rightClick}
      color={color}
      state={state}
    >
      {children}
    </LabelButtonBase>
  );
});
