import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Loader2, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSelector } from 'react-redux';
import { ChatMessage, type Message } from './ChatMessage';
import type { RootState } from '../../store/store';
import { getAlgorithmById } from '../../engine/catalog';

export const ChatbotWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', role: 'bot', text: "Hi! I'm AlgoBot. Ask me any question about Data Structures and Algorithms!" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const currentAlgorithmStr = useSelector((state: RootState) => state.visualizer.currentAlgorithm);
  const activeAlgoObj = currentAlgorithmStr ? getAlgorithmById(currentAlgorithmStr) : null;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: Message = { id: Date.now().toString(), role: 'user', text: input.trim() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    // Format history for the API (except the last user message which is handled separately)
    const history = messages.map(msg => ({
      role: msg.role === 'bot' ? 'model' : 'user',
      text: msg.text
    }));

    // Build Context
    let contextStr = "User is on the home dashboard, not viewing any specific algorithm right now.";
    if (activeAlgoObj) {
      contextStr = `User is currently viewing the visualization for the algorithm: "${activeAlgoObj.name}" (Data Structure Type: ${activeAlgoObj.dsType}). Assume their questions are related to this algorithm unless specified otherwise.`;
    }

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMsg.text,
          history,
          context: contextStr
        })
      });

      if (!response.ok) {
        throw new Error('API Error');
      }

      const data = await response.json();
      
      const botMsg: Message = { id: (Date.now() + 1).toString(), role: 'bot', text: data.reply || "No response generated." };
      setMessages(prev => [...prev, botMsg]);
    } catch (error) {
      console.error(error);
      const errorMsg: Message = { 
        id: (Date.now() + 1).toString(), 
        role: 'bot', 
        text: "Sorry, I'm having trouble connecting to the brain right now. Make sure `GEMINI_API_KEY` is configured." 
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-6 w-[380px] h-[550px] bg-black/60 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.8)] flex flex-col z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="h-14 border-b border-white/10 bg-white/5 flex items-center justify-between px-4 shrink-0 relative overflow-hidden">
               <div className="absolute top-[-50%] left-[-10%] w-[50%] h-[150%] bg-purple-600/30 rounded-full blur-[40px] pointer-events-none" />
               <div className="flex items-center gap-2 relative z-10">
                 <div className="bg-purple-500/20 p-1.5 rounded-lg border border-purple-500/30">
                   <Sparkles size={16} className="text-purple-400" />
                 </div>
                 <div>
                   <h3 className="font-semibold text-gray-100 text-sm tracking-wide">AlgoBot</h3>
                   <div className="text-[10px] text-green-400 flex items-center gap-1">
                     <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                     {activeAlgoObj ? `Context: ${activeAlgoObj.name}` : 'Online'}
                   </div>
                 </div>
               </div>
               <button 
                 onClick={() => setIsOpen(false)}
                 className="p-1.5 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors relative z-10"
               >
                 <X size={18} />
               </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 flex flex-col custom-scrollbar scroll-smooth">
              {messages.map((msg) => (
                <ChatMessage key={msg.id} message={msg} />
              ))}
              {isLoading && (
                <div className="flex gap-2 items-center text-gray-400 text-sm py-2">
                  <div className="w-6 h-6 rounded-full flex items-center justify-center bg-white/5 border border-white/10 shrink-0">
                    <Loader2 size={12} className="animate-spin text-purple-400" />
                  </div>
                  <span className="animate-pulse">Thinking recursively...</span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-3 border-t border-white/10 bg-black/40 shrink-0">
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask a DSA question..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-4 pr-12 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all font-sans"
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || isLoading}
                  className="absolute right-2 p-1.5 bg-purple-600 hover:bg-purple-500 disabled:bg-gray-700 disabled:text-gray-400 text-white rounded-lg transition-colors"
                >
                  <Send size={14} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-tr from-purple-600 to-blue-600 rounded-full flex items-center justify-center shadow-[0_4px_20px_rgba(147,51,234,0.5)] border border-white/10 z-50 group hover:shadow-[0_8px_30px_rgba(147,51,234,0.6)] cursor-pointer"
      >
        <MessageCircle size={24} className="text-white group-hover:scale-110 transition-transform" />
      </motion.button>
    </>
  );
};
