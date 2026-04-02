import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Bot, User } from 'lucide-react';

export interface Message {
  id: string;
  role: 'user' | 'bot';
  text: string;
}

interface ChatMessageProps {
  message: Message;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.role === 'user';

  return (
    <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'} mb-4 items-start`}>
      <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${isUser ? 'bg-blue-600/80' : 'bg-purple-600/80'} shadow-lg`}>
        {isUser ? <User size={16} className="text-white" /> : <Bot size={16} className="text-white" />}
      </div>
      
      <div className={`max-w-[75%] px-4 py-2.5 rounded-2xl ${
          isUser 
            ? 'bg-blue-600/20 border border-blue-500/30 text-white rounded-tr-sm' 
            : 'bg-white/10 border border-white/10 text-gray-200 rounded-tl-sm'
        } shadow-md backdrop-blur-sm`}
      >
        <div className="prose prose-invert max-w-none text-sm break-words
          prose-p:leading-relaxed prose-pre:bg-black/50 prose-pre:border prose-pre:border-white/10 prose-pre:rounded-lg
          prose-code:text-purple-300 prose-code:bg-white/5 prose-code:px-1 prose-code:rounded prose-code:font-mono text-sm leading-6"
        >
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {message.text}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
};
