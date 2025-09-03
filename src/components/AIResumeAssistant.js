import { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, Bot, User, X, Minimize2, Maximize2 } from 'lucide-react';

// Import all data for RAG context
import personalData from '../data/personal.json';
import experienceData from '../data/experience.json';
import projectsData from '../data/projects.json';
import skillsData from '../data/skills.json';
import publicationsData from '../data/publications.json';
import hackathonsData from '../data/hackathons.json';

const AIResumeAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      content: "Hi! I'm Priyanshu's AI Resume Assistant. I can answer questions about his background, experience, projects, skills, and more. What would you like to know?",
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Create comprehensive context from all data
  const createContext = () => {
    return {
      personal: personalData,
      experience: experienceData,
      projects: projectsData,
      skills: skillsData,
      publications: publicationsData,
      hackathons: hackathonsData
    };
  };

  // Simple RAG implementation - find relevant information based on query
  const findRelevantInfo = (query) => {
    const context = createContext();
    const queryLower = query.toLowerCase();
    const relevantInfo = [];

    // Check personal info
    if (queryLower.includes('name') || queryLower.includes('who') || queryLower.includes('about')) {
      relevantInfo.push(`Name: ${context.personal.name}`);
      relevantInfo.push(`Title: ${context.personal.title}`);
      relevantInfo.push(`Bio: ${context.personal.bio.join(' ')}`);
    }

    // Check skills
    if (queryLower.includes('skill') || queryLower.includes('technology') || queryLower.includes('tech')) {
      context.skills.skills.forEach(skill => {
        relevantInfo.push(`${skill.category}: ${skill.technologies} - ${skill.description}`);
      });
    }

    // Check experience
    if (queryLower.includes('experience') || queryLower.includes('work') || queryLower.includes('job')) {
      context.experience.workExperience.forEach(exp => {
        relevantInfo.push(`${exp.title} at ${exp.company} (${exp.period}): ${exp.description}`);
      });
    }

    // Check projects
    if (queryLower.includes('project') || queryLower.includes('repository') || queryLower.includes('demo')) {
      context.projects.repositories.forEach(repo => {
        relevantInfo.push(`Project: ${repo.name} - ${repo.description}. Technologies: ${repo.technologies.join(', ')}`);
      });
    }

    // Check publications
    if (queryLower.includes('publication') || queryLower.includes('blog') || queryLower.includes('article')) {
      context.publications.blogs.forEach(blog => {
        relevantInfo.push(`Blog: ${blog.title} - ${blog.summary}`);
      });
      context.publications.publications.forEach(pub => {
        relevantInfo.push(`Publication: ${pub.title} - ${pub.abstract}`);
      });
    }

    // Check hackathons
    if (queryLower.includes('hackathon') || queryLower.includes('competition') || queryLower.includes('award')) {
      context.hackathons.hackathons.forEach(hack => {
        relevantInfo.push(`Hackathon: ${hack.name} - ${hack.description}. Achievements: ${hack.achievements}`);
      });
    }

    // Check contact info
    if (queryLower.includes('contact') || queryLower.includes('email') || queryLower.includes('reach')) {
      relevantInfo.push(`Email: ${context.personal.contact.email}`);
      relevantInfo.push(`Status: ${context.personal.contact.status}`);
      relevantInfo.push(`Location: ${context.personal.contact.location}`);
    }

    return relevantInfo;
  };

  // Generate AI response based on query and context
  const generateResponse = async (query) => {
    const relevantInfo = findRelevantInfo(query);
    
    // If no specific info found, provide general response
    if (relevantInfo.length === 0) {
      return "I can help you learn about Priyanshu's background, skills, experience, projects, publications, and contact information. Try asking about his technical skills, work experience, or recent projects!";
    }

    // For demo purposes, create a contextual response
    // In a real implementation, this would use OpenAI API
    const queryLower = query.toLowerCase();
    
    if (queryLower.includes('skill') || queryLower.includes('technology')) {
      return `Priyanshu has expertise in several key areas:\n\n${relevantInfo.slice(0, 3).join('\n\n')}\n\nHe's particularly strong in full-stack development and AI/ML technologies. Would you like to know more about any specific technology?`;
    }
    
    if (queryLower.includes('experience') || queryLower.includes('work')) {
      return `Here's information about Priyanshu's work experience:\n\n${relevantInfo.join('\n\n')}\n\nHe has ${personalData.stats.yearsExperience} years of professional experience. Would you like to know more about any specific role?`;
    }
    
    if (queryLower.includes('project')) {
      return `Priyanshu has worked on ${personalData.stats.projectsCompleted} projects. Here are some highlights:\n\n${relevantInfo.slice(0, 2).join('\n\n')}\n\nWould you like to see more projects or learn about specific technologies used?`;
    }
    
    if (queryLower.includes('contact') || queryLower.includes('hire') || queryLower.includes('reach')) {
      return `You can reach Priyanshu at:\n\n${relevantInfo.join('\n')}\n\nHe's currently ${personalData.contact.status.toLowerCase()} and ${personalData.contact.responseTime.toLowerCase()}.`;
    }

    // Default response with relevant info
    return `Here's what I found about that:\n\n${relevantInfo.slice(0, 3).join('\n\n')}\n\nIs there anything specific you'd like to know more about?`;
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const response = await generateResponse(inputMessage);
      
      const botMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: response,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      const errorMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: "I'm sorry, I encountered an error. Please try asking your question again.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const suggestedQuestions = [
    "What are Priyanshu's main technical skills?",
    "Tell me about his work experience",
    "What projects has he worked on?",
    "How can I contact him?",
    "What's his background in AI/ML?"
  ];

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setIsOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-110"
          aria-label="Open AI Resume Assistant"
        >
          <MessageCircle size={24} />
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-2xl border border-gray-200 dark:border-gray-700 transition-all duration-300 ${
        isMinimized ? 'w-80 h-16' : 'w-96 h-[500px]'
      }`}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-blue-600 text-white rounded-t-lg">
          <div className="flex items-center space-x-2">
            <Bot size={20} />
            <h3 className="font-semibold">AI Resume Assistant</h3>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="hover:bg-blue-700 p-1 rounded"
            >
              {isMinimized ? <Maximize2 size={16} /> : <Minimize2 size={16} />}
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="hover:bg-blue-700 p-1 rounded"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {!isMinimized && (
          <>
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 h-80">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`mb-4 flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex items-start space-x-2 max-w-[80%] ${
                    message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                  }`}>
                    <div className={`p-2 rounded-full ${
                      message.type === 'user' 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                    }`}>
                      {message.type === 'user' ? <User size={16} /> : <Bot size={16} />}
                    </div>
                    <div className={`p-3 rounded-lg ${
                      message.type === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                    }`}>
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    </div>
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex justify-start mb-4">
                  <div className="flex items-start space-x-2">
                    <div className="p-2 rounded-full bg-gray-200 dark:bg-gray-700">
                      <Bot size={16} />
                    </div>
                    <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Suggested Questions */}
            {messages.length === 1 && (
              <div className="px-4 pb-2">
                <p className="text-xs text-gray-500 mb-2">Try asking:</p>
                <div className="flex flex-wrap gap-1">
                  {suggestedQuestions.slice(0, 3).map((question, index) => (
                    <button
                      key={index}
                      onClick={() => setInputMessage(question)}
                      className="text-xs bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 px-2 py-1 rounded text-gray-700 dark:text-gray-300"
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask about Priyanshu's background..."
                  className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white text-sm"
                  disabled={isLoading}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={isLoading || !inputMessage.trim()}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white p-2 rounded-lg transition-colors"
                >
                  <Send size={16} />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AIResumeAssistant;