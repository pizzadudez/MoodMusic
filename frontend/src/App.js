import React, { memo, useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { StylesProvider } from '@material-ui/core/styles';
import { useSelector, useDispatch } from 'react-redux';
import { createSelector } from 'reselect';

import { fetchData } from './actions/dataActions';
import Main from './views/Main';

const stateSelector = createSelector(
  state => state.app.authorized,
  authorized => ({ authorized })
);

export default memo(() => {
  const dispatch = useDispatch();
  const { authorized } = useSelector(stateSelector);
  
  useEffect(() => {
    dispatch(fetchData());
  }, [])

  return (
    <StylesProvider injectFirst>
      {authorized && (
        <Router>
          <Switch>
            <Route path="/">
              <Main />
            </Route>
          </Switch>
        </Router>
      )}
      {!authorized && (
        <a href="http://localhost:8888/auth">
        <button 
          text={'Authorize'}
          onClick={() => console.log('authTest')}
        />
      </a>
      )}
    </StylesProvider>
  );
});