import Layout from '../components/Layout'
import personalData from '../data/personal.json'

export default function Contact() {
  return (
    <Layout title="Contact - Portfolio">
      {/* Contact Section */}
      <section id="contact" className="pt-24 pb-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold text-center text-gray-900 mb-16">Contact Me</h1>
          
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="bg-white rounded-lg shadow-lg p-8 border border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Send a Message</h2>
              <form className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">Name</label>
                  <input type="text" 
                         id="name" 
                         name="name" 
                         placeholder="Your Name" 
                         required 
                         className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200" />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                  <input type="email" 
                         id="email" 
                         name="email" 
                         placeholder="Your Email" 
                         required 
                         className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200" />
                </div>
                <div>
                  <label htmlFor="subject" className="block text-sm font-semibold text-gray-700 mb-2">Subject</label>
                  <input type="text" 
                         id="subject" 
                         name="subject" 
                         placeholder="Subject" 
                         required 
                         className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200" />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-2">Message</label>
                  <textarea id="message" 
                            name="message" 
                            placeholder="Your Message" 
                            rows="5" 
                            required 
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-vertical"></textarea>
                </div>
                <button type="submit" 
                        className="btn btn-primary w-full text-lg py-3">
                  📧 Send Message
                </button>
              </form>
              
              <div className="mt-8 pt-6 border-t border-gray-200">
                <p className="text-sm text-gray-600 text-center">
                  Form submission will be integrated with email service in Stage 5
                </p>
              </div>
            </div>
            
            {/* Contact Information & Social Links */}
            <div className="space-y-8">
              {/* Contact Info */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Get In Touch</h2>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center mr-4">
                      <span className="text-white text-lg">📧</span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-700">Email</p>
                      <a href={`mailto:${personalData.contact.email}`} 
                         className="text-blue-600 hover:text-blue-800 transition-colors">
                        {personalData.contact.email}
                      </a>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center mr-4">
                      <span className="text-white text-lg">💼</span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-700">Professional Status</p>
                      <p className="text-gray-600">{personalData.contact.status}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center mr-4">
                      <span className="text-white text-lg">🌍</span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-700">Location</p>
                      <p className="text-gray-600">{personalData.contact.location}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Social Links */}
              <div className="bg-white rounded-lg shadow-lg p-8 border border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Connect with Me</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <a href={personalData.links.resume} 
                     target="_blank" 
                     rel="noopener noreferrer"
                     className="flex items-center p-4 bg-red-50 hover:bg-red-100 rounded-lg transition-colors border border-red-200">
                    <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center mr-3">
                      <span className="text-white text-lg">📄</span>
                    </div>
                    <div>
                      <p className="font-semibold text-red-800">Resume</p>
                      <p className="text-red-600 text-sm">Download PDF</p>
                    </div>
                  </a>
                  
                  <a href={personalData.links.github} 
                     target="_blank" 
                     rel="noopener noreferrer"
                     className="flex items-center p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors border border-gray-200">
                    <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center mr-3">
                      <span className="text-white text-lg">🐱</span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">GitHub</p>
                      <p className="text-gray-600 text-sm">@xoTEMPESTox</p>
                    </div>
                  </a>
                  
                  <a href={personalData.links.linkedin} 
                     target="_blank" 
                     rel="noopener noreferrer"
                     className="flex items-center p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors border border-blue-200">
                    <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center mr-3">
                      <span className="text-white text-lg">💼</span>
                    </div>
                    <div>
                      <p className="font-semibold text-blue-800">LinkedIn</p>
                      <p className="text-blue-600 text-sm">Priyanshu Sah</p>
                    </div>
                  </a>
                  
                  <a href={personalData.links.codolio} 
                     target="_blank" 
                     rel="noopener noreferrer"
                     className="flex items-center p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors border border-green-200">
                    <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center mr-3">
                      <span className="text-white text-lg">⚡</span>
                    </div>
                    <div>
                      <p className="font-semibold text-green-800">Codolio</p>
                      <p className="text-green-600 text-sm">_TEMPEST_</p>
                    </div>
                  </a>
                </div>
              </div>
              
              {/* Response Time */}
              <div className="bg-yellow-50 rounded-lg p-6 border border-yellow-200">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center mr-3">
                    <span className="text-white text-sm">⏱️</span>
                  </div>
                  <div>
                    <p className="font-semibold text-yellow-800">Quick Response</p>
                    <p className="text-yellow-700 text-sm">{personalData.contact.responseTime}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  )
}