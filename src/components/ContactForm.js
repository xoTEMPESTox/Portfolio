import { useState } from 'react';
import { useForm } from '@formspree/react';
import { Send, CheckCircle, AlertCircle, Mail, User, MessageSquare, Loader } from 'lucide-react';

const ContactForm = () => {
  const [state, handleSubmit] = useForm("xpwzgqko"); // Replace with your Formspree form ID
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validation rules
  const validateForm = () => {
    const newErrors = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Subject validation
    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required';
    } else if (formData.subject.trim().length < 5) {
      newErrors.subject = 'Subject must be at least 5 characters';
    }

    // Message validation
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters';
    } else if (formData.message.trim().length > 1000) {
      newErrors.message = 'Message must be less than 1000 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      await handleSubmit(e);
      
      // Reset form on successful submission
      if (state.succeeded) {
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: ''
        });
        setErrors({});
      }
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Success state
  if (state.succeeded) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 text-center">
        <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
        </div>
        <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
          Message Sent Successfully!
        </h3>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Thank you for reaching out! I&apos;ll get back to you within 24 hours.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
        >
          Send Another Message
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2 flex items-center">
          <Mail className="w-6 h-6 mr-2 text-blue-500" />
          Get In Touch
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          Have a project in mind or want to collaborate? I&apos;d love to hear from you!
        </p>
      </div>

      {/* Error state */}
      {state.errors && state.errors.length > 0 && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 mr-2" />
            <span className="text-sm text-red-800 dark:text-red-200">
              There was an error sending your message. Please try again.
            </span>
          </div>
        </div>
      )}

      <form onSubmit={onSubmit} className="space-y-6">
        {/* Name Field */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            <User className="w-4 h-4 inline mr-1" />
            Full Name *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors dark:bg-gray-700 dark:text-white ${
              errors.name 
                ? 'border-red-500 focus:ring-red-500' 
                : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500'
            }`}
            placeholder="Enter your full name"
            disabled={isSubmitting}
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.name}</p>
          )}
        </div>

        {/* Email Field */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            <Mail className="w-4 h-4 inline mr-1" />
            Email Address *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors dark:bg-gray-700 dark:text-white ${
              errors.email 
                ? 'border-red-500 focus:ring-red-500' 
                : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500'
            }`}
            placeholder="Enter your email address"
            disabled={isSubmitting}
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.email}</p>
          )}
        </div>

        {/* Subject Field */}
        <div>
          <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            <MessageSquare className="w-4 h-4 inline mr-1" />
            Subject *
          </label>
          <input
            type="text"
            id="subject"
            name="subject"
            value={formData.subject}
            onChange={handleInputChange}
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors dark:bg-gray-700 dark:text-white ${
              errors.subject 
                ? 'border-red-500 focus:ring-red-500' 
                : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500'
            }`}
            placeholder="What's this about?"
            disabled={isSubmitting}
          />
          {errors.subject && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.subject}</p>
          )}
        </div>

        {/* Message Field */}
        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            <MessageSquare className="w-4 h-4 inline mr-1" />
            Message *
          </label>
          <textarea
            id="message"
            name="message"
            rows={6}
            value={formData.message}
            onChange={handleInputChange}
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors resize-none dark:bg-gray-700 dark:text-white ${
              errors.message 
                ? 'border-red-500 focus:ring-red-500' 
                : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500'
            }`}
            placeholder="Tell me about your project or how I can help you..."
            disabled={isSubmitting}
          />
          <div className="flex justify-between items-center mt-1">
            {errors.message ? (
              <p className="text-sm text-red-600 dark:text-red-400">{errors.message}</p>
            ) : (
              <span></span>
            )}
            <span className={`text-sm ${
              formData.message.length > 1000 
                ? 'text-red-600 dark:text-red-400' 
                : 'text-gray-500 dark:text-gray-400'
            }`}>
              {formData.message.length}/1000
            </span>
          </div>
        </div>

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            disabled={isSubmitting || state.submitting}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center"
          >
            {isSubmitting || state.submitting ? (
              <>
                <Loader className="w-5 h-5 mr-2 animate-spin" />
                Sending Message...
              </>
            ) : (
              <>
                <Send className="w-5 h-5 mr-2" />
                Send Message
              </>
            )}
          </button>
        </div>

        {/* Additional Info */}
        <div className="text-center pt-4 border-t border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            You can also reach me directly at{' '}
            <a 
              href="mailto:priyanshu123sah@gmail.com" 
              className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
            >
              priyanshu123sah@gmail.com
            </a>
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
            I typically respond within 24 hours
          </p>
        </div>
      </form>
    </div>
  );
};

export default ContactForm;