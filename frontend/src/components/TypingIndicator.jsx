import React from 'react';

const TypingIndicator = () => {
  return (
    <div className="flex items-center gap-1 p-2">
      <div className="flex gap-1">
        <div className="w-2 h-2 rounded-full bg-base-content/50 animate-bounce" style={{ animationDelay: '0ms' }}></div>
        <div className="w-2 h-2 rounded-full bg-base-content/50 animate-bounce" style={{ animationDelay: '150ms' }}></div>
        <div className="w-2 h-2 rounded-full bg-base-content/50 animate-bounce" style={{ animationDelay: '300ms' }}></div>
      </div>
    </div>
  );
};

export default TypingIndicator; 