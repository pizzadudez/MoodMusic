import React, { memo } from 'react';
import Button from '@material-ui/core/Button';
import styled from 'styled-components';

export default memo(({ text, onClick, id, filter }) => {
  console.log('FilterButton');

  return (
    <FilterButton variant="contained" filter={filter} onClick={onClick(id)}>
      {text}
    </FilterButton>
  );
});

const FilterButton = styled(({ filter, ...rest }) => <Button {...rest} />)`
  margin: 3px;
  font-size: 1em;
  letter-spacing: normal;
  text-transform: none;
  min-width: 40px;
  &.MuiButton-contained {
    background-color: ${props =>
      props.filter === true
        ? 'green'
        : props.filter === false
        ? 'red'
        : 'white'};
  }
  &.MuiButton-contained:hover {
    background-color: ${props =>
      props.filter === true
        ? 'green'
        : props.filter === false
        ? 'red'
        : 'white'};
  }
`;
