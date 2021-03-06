import React, { memo, useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { StylesProvider } from '@material-ui/core/styles';
import { useSelector, useDispatch } from 'react-redux';
import { createSelector } from 'reselect';
import styled from 'styled-components';

import { authenticate } from './actions/appActions';
import { fetchData } from './actions/dataActions';
import LoadingSpinner from './components/LoadingSpinner';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ConfirmModal from './components/ConfirmModal';
import Main from './views/Main';
import Labels from './views/Labels';
import Playlists from './views/Playlists';
import Login from './views/Login';
import Tests from './views/Tests';

const stateSelector = createSelector(
  state => state.app.authenticated,
  state => state.app.loadingData,
  (authenticated, loadingData) => ({ authenticated, loadingData })
);

export default memo(() => {
  const dispatch = useDispatch();
  const { authenticated, loadingData } = useSelector(stateSelector);

  useEffect(() => {
    dispatch(authenticate());
  }, [dispatch]);

  useEffect(() => {
    if (authenticated) dispatch(fetchData());
  }, [dispatch, authenticated]);

  return (
    <StylesProvider injectFirst>
      {authenticated && !loadingData && (
        <Page>
          <Router>
            <Navbar />
            <Switch>
              <Route path="/tests">
                <Tests />
              </Route>
              <Route path="/labels">
                <Labels />
              </Route>
              <Route path="/playlists">
                <Playlists />
              </Route>
              <Route path="/">
                <Main />
              </Route>
            </Switch>
            <Footer />
          </Router>
          <ConfirmModal />
        </Page>
      )}
      {authenticated && loadingData && <LoadingSpinner />}
      {!authenticated && <Login />}
    </StylesProvider>
  );
});

const Page = styled.div`
  height: 100vh;
  display: grid;
  grid-template-rows: 60px 1fr 30px;
`;
