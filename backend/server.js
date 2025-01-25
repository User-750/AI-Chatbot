const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());
app.use(express.json());

app.post('/chat', async (req, res) => {
    const { message } = req.body;

    console.log('Received message:', message);  // Debugging log

    try {
        const ollamaResponse = await axios.post('http://localhost:11434/api/generate', {
            model: 'llama3.2:1b',  // Exactly matching your installed model
            prompt: message,
            stream: false
        });

        console.log('Ollama Raw Response:', ollamaResponse.data);  // Detailed logging

        // Check if response exists and has content
        if (ollamaResponse.data && ollamaResponse.data.response) {
            res.json({ 
                response: ollamaResponse.data.response.trim() 
            });
        } else {
            res.status(500).json({ 
                error: 'No valid response from Ollama',
                rawResponse: ollamaResponse.data 
            });
        }
    } catch (error) {
        console.error('Detailed Ollama API Error:', error.response ? error.response.data : error.message);
        res.status(500).json({ 
            error: 'Failed to get response from Ollama',
            details: error.message 
        });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// frontend/script.js
async function sendMessage() {
    const userInput = document.getElementById('user-input');
    const chatMessages = document.getElementById('chat-messages');
    const message = userInput.value;

    // Clear previous error messages
    const existingErrorMessage = document.querySelector('.error');
    if (existingErrorMessage) {
        existingErrorMessage.remove();
    }

    // Display user message
    chatMessages.innerHTML += `<div class="user-message">You: ${message}</div>`;

    try {
        const response = await fetch('http://localhost:3000/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message }),
        });

        // Log the raw response for debugging
        console.log('Raw Server Response:', response);

        // Check if response is successful
        if (!response.ok) {
            const errorBody = await response.text();
            throw new Error(`HTTP error! status: ${response.status}, message: ${errorBody}`);
        }

        const data = await response.json();
        
        // Robust response handling
        if (data && data.response) {
            chatMessages.innerHTML += `<div class="ai-message">AI: ${data.response}</div>`;
        } else {
            throw new Error('Invalid response format');
        }
    } catch (error) {
        console.error('Detailed Frontend Error:', error);
        chatMessages.innerHTML += `<div class="error">Error: ${error.message}</div>`;
    }

    userInput.value = '';
}