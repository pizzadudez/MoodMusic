import React, { memo, useCallback, useState } from 'react';

import LabelButtonBase from '../common/LabelButtonBase';

export default memo(({ itemId, color, add, remove, children }) => {
  const [selected, setSelected] = useState(false);
  const leftClick = useCallback(() => {
    setSelected(selected => {
      if (selected === 'add') {
        add(itemId, false);
        return false;
      } else if (selected === 'remove') {
        add(itemId);
        remove(itemId, false);
      } else {
        add(itemId);
      }
      return 'add';
    });
  }, [setSelected, add, remove, itemId]);
  const rightClick = useCallback(
    e => {
      e.preventDefault();
      setSelected(selected => {
        if (selected === 'remove') {
          remove(itemId, false);
          return false;
        } else if (selected === 'add') {
          remove(itemId);
          add(itemId, false);
        } else {
          remove(itemId);
        }
        return 'remove';
      });
    },
    [setSelected, add, remove, itemId]
  );

  return (
    <LabelButtonBase
      leftClick={leftClick}
      rightClick={rightClick}
      color={color}
      state={selected}
    >
      {children}
    </LabelButtonBase>
  );
});
