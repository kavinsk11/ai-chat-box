import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Box, Typography, Paper, CircularProgress } from '@mui/material';

// Function to fetch conversation data
const fetchConversationData = async (conversationId, storeId) => {
  const response = await fetch(`https://chateasy.logbase.io/api/conversation?id=${conversationId}&storeId=${storeId}`);
  if (response.ok) {
    return response.json();
  } else {
    throw new Error('Failed to fetch conversation data');
  }
};

// Function to filter conversation data and extract messages, product names, and images
const filterConversation = (conversationData) => {
  const userMessages = [];
  const systemReplies = [];
  for (const conv of conversationData.conversation) {
    if (conv.type === 'user') {
      userMessages.push(...conv.messages);
    } else if (conv.type === 'system') {
      for (const msg of conv.messages) {
        if (msg.message) {
          const cleanMsg = msg.message
            .replace(/&#39;/g, "'") // Replace &#39; with '
            .replace(/<[^>]*>/g, ''); // Remove HTML tags
          systemReplies.push({ message: cleanMsg });
        }
        if (msg.cards) {
          msg.cards.forEach(card => {
            systemReplies.push({
              productName: card.buttons[0].productName,
              imageUrl: card.imageUrl || card.buttons[1].imageUrl,
              url: card.url || card.buttons[0].url
            });
          });
        }
      }
    }
  }
  return { userMessages, systemReplies };
};

// Main component to display the conversation
const ConversationPage = () => {
  const { conversationId, storeId } = useParams();
  const [conversationData, setConversationData] = useState(null);
  const [error, setError] = useState(null);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchConversationData(conversationId, storeId)
      .then((data) => {
        setConversationData(data);
        filterProducts(data);
      })
      .catch((error) => setError(error.message));
  }, [conversationId, storeId]);

  const filterProducts = (conversationData) => {
    const productRecords = [];
    for (const conv of conversationData.conversation) {
      if (conv.type === 'system') {
        for (const msg of conv.messages) {
          if (msg.cards) {
            msg.cards.forEach(card => {
              productRecords.push({
                productName: card.buttons[0].productName,
                imageUrl: card.imageUrl || card.buttons[1].imageUrl,
                url: card.url || card.buttons[0].url
              });
            });
          }
        }
      }
    }
    setProducts(productRecords);
  };

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
              {systemReplies[index] && (
                <>
                  <Typography variant="body1"><strong>System:</strong> {systemReplies[index].message}</Typography>
                  {systemReplies[index].productName && (
                    <Typography variant="body1"><strong>Product Name:</strong> {systemReplies[index].productName}</Typography>
                  )}
                  {systemReplies[index].url && (
                    <Typography variant="body1"><strong>Product URL:</strong> <a href={systemReplies[index].url} target="_blank" rel="noopener noreferrer">{systemReplies[index].url}</a></Typography>
                  )}
                  {systemReplies[index].imageUrl && (
                    <Box sx={{ mt: 2 }}>
                      <img src={systemReplies[index].imageUrl} alt="Product" style={{ maxWidth: '100%' }} />
                    </Box>
                  )}
                </>
              )}
            </Box>
          ))}
        </Box>
        {products.map((product, index) => (
          <Box key={index} sx={{ mb: 2 }}>
            <Typography variant="body1"><strong>Product Name:</strong> {product.productName}</Typography>
            {product.url && (
              <Typography variant="body1"><strong>Product URL:</strong> <a href={product.url} target="_blank" rel="noopener noreferrer">{product.url}</a></Typography>
            )}
            {product.imageUrl && (
              <Box sx={{ mt: 2 }}>
                <img src={product.imageUrl} alt="Product" style={{ maxWidth: '100%' }} />
              </Box>
            )}
          </Box>
        ))}
        <Typography variant="body2" sx={{ mt: 2 }}>
          View the JSON file <a href={`https://chateasy.logbase.io/api/conversation?id=${conversationId}&storeId=${storeId}`} target="_blank" rel="noopener noreferrer">here</a>.
        </Typography>
      </Paper>
    </Container>
  );
};

export default ConversationPage;

