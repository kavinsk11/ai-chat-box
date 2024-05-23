import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, TextField, Button, Box, Typography, Paper } from '@mui/material';

const HomePage = () => {
  const [conversationId, setConversationId] = useState('');
  const [storeId, setStoreId] = useState('');
  const navigate = useNavigate();

  const handleSubmit = () => {
    if (conversationId && storeId) {
      navigate(`/conversation/${conversationId}/${storeId}`);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Paper elevation={3} sx={{ p: 4, mt: 8 }}>
        <Typography component="h1" variant="h5" gutterBottom>
          AI Chat Box
        </Typography>
        <Box component="form" noValidate sx={{ mt: 1 }}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="conversationId"
            label="Conversation ID"
            name="conversationId"
            autoComplete="conversation-id"
            autoFocus
            value={conversationId}
            onChange={(e) => setConversationId(e.target.value)}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="storeId"
            label="Store ID"
            type="storeId"
            id="storeId"
            autoComplete="store-id"
            value={storeId}
            onChange={(e) => setStoreId(e.target.value)}
          />
          <Button
            type="button"
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 3, mb: 2 }}
            onClick={handleSubmit}
          >
            Enter
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default HomePage;
