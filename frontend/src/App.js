import React, { memo, useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { StylesProvider } from '@material-ui/core/styles';
import { useSelector, useDispatch } from 'react-redux';
import { createSelector } from 'reselect';
import styled from 'styled-components';

import { fetchData } from './actions/dataActions';
import LoadingSpinner from './components/LoadingSpinner';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ConfirmModal from './components/ConfirmModal';
import Main from './views/Main';
import Labels from './views/Labels';
import Playlists from './views/Playlists';

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
  }, [dispatch]);

  return (
    <StylesProvider injectFirst>
      {authorized && !loadingData && (
        <Page>
          <Router>
            <Navbar />
            <Switch>
              <Route path="/labels">
                <Labels />
              </Route>
              <Router path="/playlists">
                <Playlists />
              </Router>
              <Route path="/">
                <Main />
              </Route>
            </Switch>
            <Footer />
          </Router>
          <ConfirmModal />
        </Page>
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

const Page = styled.div`
  height: 100vh;
  display: grid;
  grid-template-rows: 60px 1fr 30px;
`;
