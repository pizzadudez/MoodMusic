import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

import { Provider } from 'react-redux';
import store from './store';
import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  html {
    font-family: "Raleway","Proxima Nova","Montserrat",
    "Segoe UI",Roboto,Oxygen-Sans,
    Ubuntu,Cantarell,"Helvetica Neue",sans-serif;
    /* Scrollbar */
    --scrollbarBG: #3838384a;
    --thumbBG: #4bffb170;
  }
  body {
    margin: 0;
    padding: 0;
    background-color: #333;
    overflow: hidden;
  }
  /* Scrollbar */
  ::-webkit-scrollbar {
    width: 6px;
  }
  ::-webkit-scrollbar-track {
    background: var(--scrollbarBG);
  }
  ::-webkit-scrollbar-thumb {
    background-color: var(--thumbBG) ;
    border-radius: 6px;
    border: 3px solid var(--scrollbarBG);
  }
`;

ReactDOM.render(
  <Provider store={store}>
    <GlobalStyle />
    <App />
  </Provider>,
  document.getElementById('root')
);
