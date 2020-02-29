import React, { memo, useState, useRef, useLayoutEffect } from 'react';
import styled from 'styled-components';

import Tooltip from '@material-ui/core/Tooltip';

export default memo(({ children, ...props }) => {
  const [show, setShow] = useState(false);
  const childRef = useRef(null);

  useLayoutEffect(() => {
    if (childRef.current) {
      const { scrollWidth, offsetWidth } = childRef.current;
      if (scrollWidth > offsetWidth) {
        setShow(true);
      } else {
        setShow(false);
      }
    }
    //eslint-disable-next-line
  }, [childRef.current]);

  const child = React.Children.only(children);
  const childWithRef = React.cloneElement(child, {
    ref: childRef,
  });

  if (!show) {
    return childWithRef;
  }
  return (
    <StyledTooltip placement="bottom-start" {...props}>
      {childWithRef}
    </StyledTooltip>
  );
});

const StyledTooltip = styled(({ className, ...props }) => (
  <Tooltip classes={{ popper: className }} {...props} />
))`
  margin-top: -12px;
  & .MuiTooltip-tooltip {
    font-size: 0.92rem;
    background-color: #272727;
    border: 1px solid grey;
    box-shadow: 0px 3px 1px -2px rgba(0, 0, 0, 0.2),
      0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12);
  }
`;
