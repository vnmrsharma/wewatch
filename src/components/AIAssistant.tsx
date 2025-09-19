import React, { useState } from 'react';
import { Send, MessageCircle, Sparkles, MapPin } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { UserProfile } from '../types/user';
import { apiService } from '../services/apiService';

interface AIAssistantProps {
  user: UserProfile;
}

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export const AIAssistant: React.FC<AIAssistantProps> = ({ user }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'assistant',
      content: `Hello ${user.name}! I'm EcoPal, your friendly AI climate companion, powered by Gemini 2.5. I can help you understand environmental risks in ${user.location.city}, suggest climate actions, explain complex environmental data, and answer any questions about climate change specific to your area. What would you like to know?`,
      timestamp: new Date().toISOString()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const suggestedQuestions = [
    `What are the main climate risks for ${user.location.city}?`,
    'How can I reduce my carbon footprint at home?',
    'What environmental activities can I do with my community?',
    'Explain the current air quality data for my area',
    'What climate adaptation strategies work best here?'
  ];

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      // Call real Gemini API if available
      const hasGeminiAPI = import.meta.env.VITE_GEMINI_API_KEY;
      
      let responseContent: string;
      
      if (hasGeminiAPI) {
        const prompt = `
          You are an AI climate assistant helping users in ${user.location.city}, ${user.location.country}.
          User question: ${inputValue}
          
          Provide a helpful, accurate response about climate and environmental topics specific to their location.
          Keep the response conversational and actionable.
        `;
        
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-goog-api-key': import.meta.env.VITE_GEMINI_API_KEY
          },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: prompt
              }]
            }],
            generationConfig: {
              temperature: 0.7,
              topK: 40,
              topP: 0.95,
              maxOutputTokens: 1024,
            },
            safetySettings: [
              {
                category: 'HARM_CATEGORY_HARASSMENT',
                threshold: 'BLOCK_MEDIUM_AND_ABOVE'
              },
              {
                category: 'HARM_CATEGORY_HATE_SPEECH',
                threshold: 'BLOCK_MEDIUM_AND_ABOVE'
              },
              {
                category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
                threshold: 'BLOCK_MEDIUM_AND_ABOVE'
              },
              {
                category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
                threshold: 'BLOCK_MEDIUM_AND_ABOVE'
              }
            ]
          })
        });
        
        const data = await response.json();
        responseContent = data.candidates?.[0]?.content?.parts?.[0]?.text || generateAIResponse(inputValue, user);
      } else {
        responseContent = generateAIResponse(inputValue, user);
      }
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: responseContent,
        timestamp: new Date().toISOString()
      };

      setMessages(prev => [...prev, assistantMessage]);
      setIsLoading(false);
    } catch (error) {
      console.error('Error getting AI response:', error);
      
      // Fall back to mock response
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: generateAIResponse(inputValue, user),
        timestamp: new Date().toISOString()
      };

      setMessages(prev => [...prev, assistantMessage]);
      setIsLoading(false);
    }
  };

  const generateAIResponse = (question: string, user: UserProfile): string => {
    // This is a mock response. In a real app, this would call Gemini 2.5 API
    const responses = {
      climate: `Based on the latest data for ${user.location.city}, the primary climate concerns include rising temperatures and changing precipitation patterns. I recommend focusing on water conservation and heat adaptation strategies. Your area may benefit from community tree planting initiatives and improved urban cooling systems.`,
      carbon: `Here are personalized carbon reduction strategies for your location: 1) Switch to renewable energy if available in ${user.location.city}, 2) Use public transport or cycling for short trips, 3) Reduce meat consumption and buy local produce, 4) Improve home insulation, and 5) Consider joining local environmental groups for collective impact.`,
      community: `Based on environmental data for ${user.location.city}, I suggest: 1) Organize neighborhood cleanup events, 2) Create community gardens, 3) Host climate education workshops, 4) Participate in citizen science projects like air quality monitoring, and 5) Advocate for green infrastructure improvements.`,
      air: `Current air quality data shows moderate levels of PM2.5 and PM10 in your area. The main sources are likely vehicle emissions and industrial activity. I recommend: checking daily AQI before outdoor activities, using air purifiers indoors during high pollution days, and supporting policies for cleaner transportation.`,
      adaptation: `For ${user.location.city}, effective climate adaptation includes: 1) Rainwater harvesting systems, 2) Heat-resistant building materials, 3) Flood-resistant infrastructure, 4) Diverse local food systems, and 5) Community emergency preparedness plans. Would you like specific details on any of these strategies?`
    };

    if (question.toLowerCase().includes('climate') || question.toLowerCase().includes('risk')) {
      return responses.climate;
    } else if (question.toLowerCase().includes('carbon') || question.toLowerCase().includes('footprint')) {
      return responses.carbon;
    } else if (question.toLowerCase().includes('community') || question.toLowerCase().includes('activit')) {
      return responses.community;
    } else if (question.toLowerCase().includes('air quality')) {
      return responses.air;
    } else if (question.toLowerCase().includes('adaptation')) {
      return responses.adaptation;
    } else {
      return `Great question! Based on the environmental conditions in ${user.location.city}, I recommend starting with local environmental monitoring and community engagement. Climate action is most effective when it addresses your specific regional challenges. Would you like me to analyze specific environmental data for your area or suggest targeted actions?`;
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-4 rounded-2xl inline-block mb-4">
          <Sparkles className="h-8 w-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          EcoPal
        </h1>
        <p className="text-lg text-gray-600 flex items-center justify-center space-x-2">
          <MapPin className="h-5 w-5" />
          <span>Personalized insights for {user.location.city}</span>
        </p>
      </div>

      {/* Chat Interface */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
        {/* Messages */}
        <div className="h-96 overflow-y-auto p-6 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] p-4 rounded-2xl ${
                  message.type === 'user'
                    ? 'bg-blue-600 text-white ml-4'
                    : 'bg-gray-100 text-gray-900 mr-4'
                }`}
              >
                {message.type === 'assistant' && (
                  <div className="flex items-center space-x-2 mb-2">
                    <Sparkles className="h-4 w-4 text-purple-600" />
                    <span className="text-sm font-medium text-purple-600">EcoPal</span>
                  </div>
                )}
                <div className="leading-relaxed prose prose-sm max-w-none">
                  <ReactMarkdown
                    components={{
                      p: ({ children }) => <p className="mb-3 last:mb-0">{children}</p>,
                      strong: ({ children }) => <strong className="font-semibold text-gray-900">{children}</strong>,
                      em: ({ children }) => <em className="italic text-gray-700">{children}</em>,
                      ul: ({ children }) => <ul className="list-disc list-inside mb-3 space-y-1">{children}</ul>,
                      ol: ({ children }) => <ol className="list-decimal list-inside mb-3 space-y-1">{children}</ol>,
                      li: ({ children }) => <li className="text-gray-700">{children}</li>,
                      h1: ({ children }) => <h1 className="text-xl font-bold text-gray-900 mb-2">{children}</h1>,
                      h2: ({ children }) => <h2 className="text-lg font-semibold text-gray-900 mb-2">{children}</h2>,
                      h3: ({ children }) => <h3 className="text-base font-semibold text-gray-900 mb-1">{children}</h3>,
                      code: ({ children }) => <code className="bg-gray-100 px-1 py-0.5 rounded text-sm font-mono">{children}</code>,
                      blockquote: ({ children }) => <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-600 mb-3">{children}</blockquote>
                    }}
                  >
                    {message.content}
                  </ReactMarkdown>
                </div>
                <p className="text-xs opacity-70 mt-2">
                  {new Date(message.timestamp).toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 text-gray-900 p-4 rounded-2xl mr-4">
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600"></div>
                  <span>AI is thinking...</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="border-t border-gray-200 p-4">
          <div className="flex space-x-4">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Ask about climate risks, environmental data, or action suggestions..."
              className="flex-1 px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
              disabled={isLoading}
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isLoading}
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-3 rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Suggested Questions */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
          <MessageCircle className="h-5 w-5" />
          <span>Suggested Questions</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {suggestedQuestions.map((question, index) => (
            <button
              key={index}
              onClick={() => setInputValue(question)}
              className="text-left p-4 bg-white rounded-xl border border-gray-200 hover:border-purple-300 hover:shadow-md transition-all duration-200"
            >
              <p className="text-gray-700">{question}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};