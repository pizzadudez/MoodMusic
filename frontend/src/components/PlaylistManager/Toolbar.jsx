import React, { memo } from 'react';
import styled from 'styled-components';

import SearchFilter from '../common/SearchFilter';
import Button from '../common/Button';

export default memo(({ searchFilter }) => {
  return (
    <Container>
      <SearchFilter onChange={searchFilter} label="Filter Labels" />
      <Button disabled>Playlist Feature</Button>
    </Container>
  );
});

const Container = styled.div`
  display: grid;
  grid-template-columns: 250px min-content;
  align-items: center;
  column-gap: 6px;
`;
