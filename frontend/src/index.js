import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

import { Provider } from 'react-redux';
import store from './store';
import  { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  html {
    font-family: -apple-system,
    BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,
    Ubuntu,Cantarell,"Helvetica Neue",sans-serif;
  }
  body {
    margin: 0;
    padding: 0;
    background-color: #333;
  }
`;

ReactDOM.render(
  <Provider store={store}>
    <GlobalStyle />
    <App />
  </Provider>,
   document.getElementById('root')
);