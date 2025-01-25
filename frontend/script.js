async function sendMessage() {
    const userInput = document.getElementById('user-input');
    const chatMessages = document.getElementById('chat-messages');
    const message = userInput.value;

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

        const data = await response.json();
        chatMessages.innerHTML += `<div class="ai-message">AI: ${data.response}</div>`;
    } catch (error) {
        console.error('Error:', error);
        chatMessages.innerHTML += `<div class="error">Error: ${error.message}</div>`;
    }

    userInput.value = '';
}