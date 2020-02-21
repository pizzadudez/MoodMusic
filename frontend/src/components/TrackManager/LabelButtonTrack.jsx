import React, { memo, useCallback, useState } from 'react';

import LabelButtonBase from '../common/LabelButtonBase';

export default memo(({ itemId, color, select, original, children }) => {
  const [selected, setSelected] = useState(false);
  const click = useCallback(() => {
    select(itemId);
    setSelected(selected => !selected);
  }, [select, setSelected, itemId]);

  return (
    <LabelButtonBase
      leftClick={click}
      color={color}
      state={selected ? (original ? 'remove' : 'add') : original ? true : false}
    >
      {children}
    </LabelButtonBase>
  );
});
