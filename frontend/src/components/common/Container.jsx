import styled from 'styled-components';
import Paper from '@material-ui/core/paper';

export default styled(Paper)`
  min-height: 0;
  margin: 8px 0;
  padding: 8px;
  background-color: #272727;
  color: #ceded1;
`;

/* Use this component instead of ContainerColumn to get a max height container,
   useful for react-virtualized. */
