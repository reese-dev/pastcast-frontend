import React, { useState, useRef, useEffect } from 'react';

interface ChatMessage {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

const AIChat: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'ai',
      content: "Hello! I'm your AI weather assistant. I can help you with weather probability analysis, location comparisons, and timing recommendations. What would you like to know?",
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: inputMessage
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get AI response');
      }

      const data = await response.json();

      const normalized = typeof data.response === 'string' && data.response.trim().length > 0
        ? data.response
        : "I couldn't interpret that. Try asking about rain (%) or temperature (°C) for a place and date.";

      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: normalized,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('AI chat error', error);
      
      // Check if the error is a connection error (backend not running)
      const isConnectionError = error instanceof TypeError && error.message.includes('fetch');
      
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: isConnectionError 
          ? "I'm unable to connect to the backend server. Please ensure the mock server is running by executing 'npm run mock:server' in a separate terminal. For weather queries, include a location, date, and metric (e.g., 'rain probability in Paris on May 15' or 'temperature in Tokyo in April')."
          : "I'm sorry, I encountered an error processing your request. Please try asking about weather conditions with a specific location, date, and metric (e.g., rain %, temperature °C, wind speed, etc.).",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const suggestedQuestions = [
    "When is the best time for a wedding in Paris in May?",
    "Compare weather in New York vs London in July",
    "What's the probability of rain in Tokyo in April?",
    "When is the safest time for outdoor activities in Miami?",
    "Which location has better weather: Sydney or Melbourne in December?"
  ];

  const handleSuggestedQuestion = (question: string) => {
    setInputMessage(question);
  };

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 h-[600px] flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-white/20">
        <h2 className="text-xl font-bold text-white">AI Weather Assistant</h2>
        <p className="text-white/70 text-sm">Ask me anything about weather probabilities and historical patterns</p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-3 ${
                message.type === 'user'
                  ? 'bg-gradient-to-r from-nasa-red to-nasa-blue text-white'
                  : 'bg-white/20 text-white'
              }`}
            >
              <p className="text-sm">{message.content}</p>
              <p className="text-xs opacity-70 mt-1">
                {message.timestamp.toLocaleTimeString()}
              </p>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white/20 rounded-lg p-3">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Questions */}
      {messages.length === 1 && (
        <div className="p-4 border-t border-white/20">
          <h3 className="text-white font-medium mb-3">Try asking:</h3>
          <div className="flex flex-wrap gap-2">
            {suggestedQuestions.map((question, index) => (
              <button
                key={index}
                onClick={() => handleSuggestedQuestion(question)}
                className="px-3 py-1 bg-white/10 text-white/80 text-xs rounded-full hover:bg-white/20 transition-colors"
              >
                {question}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Form */}
      <form className="p-4 border-t border-white/20" onSubmit={handleSubmit}>
        <div className="flex space-x-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Ask about weather probabilities..."
            className="flex-1 px-4 py-2 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!inputMessage.trim() || isLoading}
            className="px-6 py-2 bg-gradient-to-r from-nasa-red to-nasa-blue text-white rounded-lg hover:from-nasa-blue hover:to-nasa-red transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
};

export default AIChat;
