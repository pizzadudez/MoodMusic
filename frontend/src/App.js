import React, { memo, useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { StylesProvider } from '@material-ui/core/styles';
import { useSelector, useDispatch } from 'react-redux';
import { createSelector } from 'reselect';

import { fetchData } from './actions/dataActions';
import Main from './views/Main';
import LoadingSpinner from './components/LoadingSpinner';
import Labels from './views/Labels';

const stateSelector = createSelector(
  state => state.app.authorized,
  state => state.app.loadingData,
  (authorized, loadingData) => ({ authorized, loadingData })
);

export default memo(() => {
  const dispatch = useDispatch();
  const { authorized, loadingData } = useSelector(stateSelector);

  useEffect(() => {
    dispatch(fetchData());
  }, []);

  return (
    <StylesProvider injectFirst>
      {authorized && !loadingData && (
        <Router>
          <Switch>
            <Route path="/labels">
              <Labels />
            </Route>
            <Route path="/">
              <Main />
            </Route>
          </Switch>
        </Router>
      )}
      {authorized && loadingData && <LoadingSpinner />}
      {!authorized && (
        <a href="http://localhost:8888/auth">
          <button onClick={() => console.log('authTest')}>Authorize</button>
        </a>
      )}
    </StylesProvider>
  );
});
