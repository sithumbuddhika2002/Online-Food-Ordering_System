import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { analyzeSentiment } from '../Components/sentimentAnalysis'; // Assuming analyzeSentiment is an external function

const ChatbotContainer = styled.div`
  width: 300px;
  height: 650px;
  background-image: url('https://i.pinimg.com/736x/8c/98/99/8c98994518b575bfd8c949e91d20548b.jpg');
  background-size: cover;
  background-position: center;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  overflow-y: auto;
`;

const Avatar = styled.img`
  width: 70px;
  height: 70px;
  border-radius: 50%;
  margin-bottom: 20px;
  border: 3px solid #007BFF;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
`;

const MessageContainer = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  margin-bottom: 10px;
  overflow-y: auto;
`;

const Message = styled.div`
  margin: 10px 0;
  width: fit-content;
  max-width: 80%;
  padding: 10px;
  border-radius: 15px;
  background-color: white;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  word-wrap: break-word;
`;

const UserMessage = styled(Message)`
  align-self: flex-end;
  background-color: #e1ffc7;
`;

const BotMessage = styled(Message)`
  align-self: flex-start;
  background-color: #f1f0f0;
`;

// Animation for the typing indicator
const typingAnimation = keyframes`
  0% { opacity: 0.2; }
  20% { opacity: 1; }
  100% { opacity: 0.2; }
`;

const TypingIndicator = styled.div`
  display: flex;
  align-items: center;
  font-size: 12px;
  color: gray;

  span {
    width: 8px;
    height: 8px;
    background-color: gray;
    border-radius: 50%;
    margin: 0 2px;
    animation: ${typingAnimation} 1s infinite;
  }
`;

const InputContainer = styled.form`
  display: flex;
  margin-top: 10px;
`;

const InputField = styled.input`
  flex: 1;
  padding: 10px;
  border-radius: 20px;
  border: 1px solid #ccc;
  margin-right: 10px;
  outline: none;
`;

const SendButton = styled.button`
  background-color: #4caf50;
  color: white;
  font-weight: bold;
  padding: 10px 15px;
  border: none;
  border-radius: 20px;
  cursor: pointer;

  &:hover {
    background-color: #45a049;
  }
`;

const Chatbot = ({ userReview }) => {
  const [messages, setMessages] = useState([
    { sender: 'bot', text: "Hello, I am Sara. Please review our food. Your feedback is valuable to us." }
  ]);
  const [userMessage, setUserMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false); // Track if the bot is typing

  useEffect(() => {
    if (userReview) {
      handleNewMessage(userReview);
    }
  }, [userReview]);

  const handleNewMessage = async (review) => {
    try {
      // User message added immediately
      setMessages((prevMessages) => [...prevMessages, { sender: 'user', text: review }]);
      
      // Simulate bot typing delay
      setIsTyping(true);
      
      setTimeout(async () => {
        const sentiment = await analyzeSentiment(review);
        console.log(sentiment);

        setIsTyping(false); // Stop typing indicator
        setMessages((prevMessages) => [
          ...prevMessages,
          { sender: 'bot', text: sentiment }
        ]);
      }, 1500); // Delay of 1.5 seconds to simulate typing
    } catch (error) {
      console.error('Error fetching sentiment analysis:', error);
      setIsTyping(false);
      setMessages((prevMessages) => [...prevMessages, { sender: 'bot', text: 'Error retrieving sentiment analysis' }]);
    }
  };

  const handleInputChange = (e) => {
    setUserMessage(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (userMessage.trim()) {
      await handleNewMessage(userMessage);
      setUserMessage(''); // Clear the input field after submission
    }
  };

  return (
    <ChatbotContainer>
      <Avatar src="https://img.freepik.com/premium-photo/women-chef-avatar_1293177-5953.jpg?w=740" alt="Chatbot Avatar" />

      <MessageContainer>
        {messages.map((message, index) => (
          <div key={index}>
            {message.sender === 'user' ? (
              <UserMessage><strong>Me:</strong> {message.text}</UserMessage>
            ) : (
              <BotMessage><strong>Sara:</strong> {message.text}</BotMessage>
            )}
          </div>
        ))}

        {isTyping && (
          <BotMessage>
            <strong>Sara:</strong> 
            <TypingIndicator>
              <span></span><span></span><span></span>
            </TypingIndicator>
          </BotMessage>
        )}
      </MessageContainer>

      <InputContainer onSubmit={handleSubmit}>
        <InputField
          type="text"
          placeholder="  Type a message..."
          value={userMessage}
          onChange={handleInputChange}
        />
        <SendButton type="submit">Send</SendButton>
      </InputContainer>
    </ChatbotContainer>
  );
};

export default Chatbot;
