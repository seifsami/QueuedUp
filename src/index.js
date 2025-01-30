import React from 'react';
import ReactDOM from 'react-dom';
import { ChakraProvider } from '@chakra-ui/react';
import App from './App';
import theme from './theme';
import { HashRouter } from "react-router-dom";  // ⬅️ Switch from BrowserRouter

ReactDOM.render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <HashRouter> {/* ⬅️ Switch to HashRouter */}
        <App />
      </HashRouter>
    </ChakraProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
