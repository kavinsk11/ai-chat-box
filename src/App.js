import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { createTheme, ThemeProvider, CssBaseline } from '@mui/material';
import HomePage from './HomePage';
import ConversationPage from './ConversationPage';

const App = () => {
  const theme = createTheme({
    palette: {
      mode: 'dark',
      primary: {
        main: '#1976d2',
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/conversation/:conversationId/:storeId" element={<ConversationPage />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default App;
