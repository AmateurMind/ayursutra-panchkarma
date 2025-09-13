import React, { forwardRef } from 'react';
import { assets } from '../../assets/assets';

const ChatbotPanel = forwardRef(({
  isChatbotOpen,
  chatbotPosition,
  handleDragStart,
  toggleChatbot,
  messages,
  messagesEndRef,
  inputRef,
  inputMessage,
  handleInputChange,
  handleKeyPress,
  handleSendMessage,
  isLoading
}, chatbotRef) => {
  return (
    <div
      ref={chatbotRef}
      className={`fixed w-80 bg-background border border-border rounded-lg shadow-lg z-50 transition-all duration-300 transform ${
        isChatbotOpen
          ? 'opacity-100 scale-100 translate-y-0'
          : 'opacity-0 scale-95 translate-y-2 pointer-events-none'
      }`}
      style={{ left: `${chatbotPosition.x}px`, top: `${chatbotPosition.y}px` }}
    >
      {/* Header */}
      <div
        className="flex justify-between items-center p-4 cursor-move bg-muted rounded-t-lg select-none"
        onMouseDown={handleDragStart}
      >
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          <h3 className="font-semibold text-foreground">PanchKarma Assistant</h3>
        </div>
        <button
          onClick={toggleChatbot}
          className="chatbot-close-btn text-text-secondary hover:text-foreground ml-4 p-1 hover:bg-background rounded transition-colors"
          aria-label="Close chatbot"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Messages */}
      <div className="p-4">
        <div className="chatbot-messages h-64 bg-muted rounded-lg p-3 mb-3 overflow-y-auto">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`mb-3 ${message.sender === 'user' ? 'text-right' : 'text-left'}`}
            >
              <div
                className={`inline-block p-3 rounded-lg max-w-[80%] ${
                  message.sender === 'user'
                    ? 'bg-primary text-primary-foreground rounded-br-sm'
                    : 'bg-secondary text-secondary-foreground rounded-bl-sm'
                }`}
              >
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.text}</p>
                <p className="text-xs opacity-70 mt-1">
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ))}

          {/* Loading indicator */}
          {isLoading && (
            <div className="text-left mb-3">
              <div className="inline-block p-3 rounded-lg bg-secondary text-secondary-foreground rounded-bl-sm">
                <div className="flex items-center">
                  <div className="text-sm">PanchKarma Assistant is thinking</div>
                  <div className="ml-2 flex space-x-1">
                    <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="chatbot-input-area flex space-x-2">
          <input
            ref={inputRef}
            type="text"
            value={inputMessage}
            onChange={handleInputChange}
            onKeyDown={handleKeyPress}
            placeholder="Ask about Panchkarma treatments, therapies, or wellness guidance..."
            className="flex-1 px-3 py-2 border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
            disabled={isLoading}
            autoComplete="off"
            spellCheck="false"
          />
          <button
            onClick={handleSendMessage}
            className="bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[60px]"
            disabled={isLoading || !inputMessage.trim()}
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
            ) : (
              'Send'
            )}
          </button>
        </div>
      </div>
    </div>
  );
});

export default ChatbotPanel;