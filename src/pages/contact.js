import Layout from '../components/Layout'
import ContactForm from '../components/ContactForm'
import personalData from '../data/personal.json'

export default function Contact() {
  return (
    <Layout title="Contact - Portfolio">
      {/* Contact Section */}
      <section id="contact" className="pt-24 pb-16 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold text-center text-gray-900 dark:text-white mb-16">Contact Me</h1>
          
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <ContactForm />
            
            {/* Contact Information & Social Links */}
            <div className="space-y-8">
              {/* Contact Info */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Get In Touch</h2>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-blue-600 dark:bg-blue-500 rounded-full flex items-center justify-center mr-4">
                      <span className="text-white text-lg">📧</span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">Email</p>
                      <a href={`mailto:${personalData.contact.email}`}
                         className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors">
                        {personalData.contact.email}
                      </a>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-green-600 dark:bg-green-500 rounded-full flex items-center justify-center mr-4">
                      <span className="text-white text-lg">💼</span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">Professional Status</p>
                      <p className="text-gray-600 dark:text-gray-400">{personalData.contact.status}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-purple-600 dark:bg-purple-500 rounded-full flex items-center justify-center mr-4">
                      <span className="text-white text-lg">🌍</span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">Location</p>
                      <p className="text-gray-600 dark:text-gray-400">{personalData.contact.location}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Social Links */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 border border-gray-200 dark:border-gray-700">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Connect with Me</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <a href={personalData.links.resume}
                     target="_blank"
                     rel="noopener noreferrer"
                     className="flex items-center p-4 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors border border-red-200 dark:border-red-800">
                    <div className="w-10 h-10 bg-red-600 dark:bg-red-500 rounded-full flex items-center justify-center mr-3">
                      <span className="text-white text-lg">📄</span>
                    </div>
                    <div>
                      <p className="font-semibold text-red-800 dark:text-red-300">Resume</p>
                      <p className="text-red-600 dark:text-red-400 text-sm">Download PDF</p>
                    </div>
                  </a>
                  
                  <a href={personalData.links.github}
                     target="_blank"
                     rel="noopener noreferrer"
                     className="flex items-center p-4 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors border border-gray-200 dark:border-gray-600">
                    <div className="w-10 h-10 bg-gray-800 dark:bg-gray-600 rounded-full flex items-center justify-center mr-3">
                      <span className="text-white text-lg">🐱</span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800 dark:text-gray-200">GitHub</p>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">@xoTEMPESTox</p>
                    </div>
                  </a>
                  
                  <a href={personalData.links.linkedin}
                     target="_blank"
                     rel="noopener noreferrer"
                     className="flex items-center p-4 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition-colors border border-blue-200 dark:border-blue-800">
                    <div className="w-10 h-10 bg-blue-600 dark:bg-blue-500 rounded-full flex items-center justify-center mr-3">
                      <span className="text-white text-lg">💼</span>
                    </div>
                    <div>
                      <p className="font-semibold text-blue-800 dark:text-blue-300">LinkedIn</p>
                      <p className="text-blue-600 dark:text-blue-400 text-sm">Priyanshu Sah</p>
                    </div>
                  </a>
                  
                  <a href={personalData.links.codolio}
                     target="_blank"
                     rel="noopener noreferrer"
                     className="flex items-center p-4 bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30 rounded-lg transition-colors border border-green-200 dark:border-green-800">
                    <div className="w-10 h-10 bg-green-600 dark:bg-green-500 rounded-full flex items-center justify-center mr-3">
                      <span className="text-white text-lg">⚡</span>
                    </div>
                    <div>
                      <p className="font-semibold text-green-800 dark:text-green-300">Codolio</p>
                      <p className="text-green-600 dark:text-green-400 text-sm">_TEMPEST_</p>
                    </div>
                  </a>
                </div>
              </div>
              
              {/* Response Time */}
              <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-6 border border-yellow-200 dark:border-yellow-800">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-yellow-500 dark:bg-yellow-600 rounded-full flex items-center justify-center mr-3">
                    <span className="text-white text-sm">⏱️</span>
                  </div>
                  <div>
                    <p className="font-semibold text-yellow-800 dark:text-yellow-300">Quick Response</p>
                    <p className="text-yellow-700 dark:text-yellow-400 text-sm">{personalData.contact.responseTime}</p>
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