import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Box, Typography, Paper, CircularProgress } from '@mui/material';

const fetchConversationData = async (conversationId, storeId) => {
  const response = await fetch(`https://chateasy.logbase.io/api/conversation?id=${conversationId}&storeId=${storeId}`);
  if (response.ok) {
    return response.json();
  } else {
    throw new Error('Failed to fetch conversation data');
  }
};

const filterConversation = (conversationData) => {
  const userMessages = [];
  const systemReplies = [];
  for (const conv of conversationData.conversation) {
    if (conv.type === 'user') {
      userMessages.push(...conv.messages);
    } else if (conv.type === 'system') {
      for (const msg of conv.messages) {
        if (msg.message) {
          const cleanMsg = msg.message.replace(/<[^>]*>/g, ''); // Remove HTML tags
          systemReplies.push({ message: cleanMsg });
        }
      }
    }
  }
  return { userMessages, systemReplies };
};

const ConversationPage = () => {
  const { conversationId, storeId } = useParams();
  const [conversationData, setConversationData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchConversationData(conversationId, storeId)
      .then((data) => setConversationData(data))
      .catch((error) => setError(error.message));
  }, [conversationId, storeId]);

  if (error) {
    return <Container><Typography variant="h6">Error: {error}</Typography></Container>;
  }

  if (!conversationData) {
    return <Container><CircularProgress /></Container>;
  }

  const { userMessages, systemReplies } = filterConversation(conversationData);

  return (
    <Container>
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Typography component="h1" variant="h5" gutterBottom>
          Conversation
        </Typography>
        <Typography component="h2" variant="subtitle1" gutterBottom>
          Conversation ID: {conversationId}, Store ID: {storeId}
        </Typography>
        <Box>
          {userMessages.map((msg, index) => (
            <Box key={index} sx={{ mb: 2 }}>
              <Typography variant="body1"><strong>User:</strong> {msg.message}</Typography>
              {systemReplies[index] && <Typography variant="body1"><strong>System:</strong> {systemReplies[index].message}</Typography>}
            </Box>
          ))}
        </Box>
        <Typography variant="body2" sx={{ mt: 2 }}>
          View the JSON file <a href={`https://chateasy.logbase.io/api/conversation?id=${conversationId}&storeId=${storeId}`} target="_blank" rel="noopener noreferrer">here</a>.
        </Typography>
      </Paper>
    </Container>
  );
};

export default ConversationPage;
