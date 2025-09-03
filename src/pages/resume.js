import Layout from '../components/Layout'
import personalData from '../data/personal.json'

export default function Resume() {
  return (
    <Layout title="Resume - Portfolio">
      {/* Resume Section */}
      <section id="resume" className="pt-24 pb-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold text-center text-gray-900 mb-16">My Resume</h1>
          
          {/* Resume Viewer */}
          <div className="max-w-4xl mx-auto mb-12">
            <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
              <div className="bg-blue-600 text-white p-6">
                <h2 className="text-2xl font-bold mb-2">Resume Viewer</h2>
                <p className="text-blue-100">Interactive resume display coming soon</p>
              </div>
              
              <div className="p-8">
                <div className="bg-gray-50 rounded-lg p-8 text-center">
                  <div className="w-24 h-24 bg-blue-100 rounded-full mx-auto mb-6 flex items-center justify-center">
                    <span className="text-3xl text-blue-600">📄</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Resume Preview</h3>
                  <p className="text-gray-600 mb-6">
                    This is a placeholder for the resume viewer. In a later stage, this will display an embedded PDF viewer 
                    for the resume with interactive features and enhanced viewing capabilities.
                  </p>
                  <div className="bg-white border-2 border-dashed border-gray-300 rounded-lg p-12 text-gray-500">
                    <p className="text-lg">Resume content will appear here...</p>
                    <p className="text-sm mt-2">PDF viewer integration coming in Stage 3</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Download and Actions Section */}
          <div className="max-w-2xl mx-auto">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg p-8 text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full mx-auto mb-6 flex items-center justify-center">
                <span className="text-2xl text-white">⬇️</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Download Resume</h2>
              <p className="text-gray-700 mb-6">
                Get the latest version of my resume in PDF format. Click the button below to download and review my 
                qualifications, experience, and skills in detail.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <a href={personalData.links.resume} 
                   className="btn btn-primary text-lg px-8 py-3" 
                   target="_blank" 
                   rel="noopener noreferrer">
                   📄 Download Resume (PDF)
                </a>
                <a href="/contact" 
                   className="btn btn-outline text-lg px-8 py-3">
                   📧 Contact Me
                </a>
              </div>
              
              <div className="mt-8 pt-6 border-t border-gray-200">
                <p className="text-sm text-gray-600 mb-4">Also available on:</p>
                <div className="flex flex-wrap justify-center gap-4">
                  <a href={personalData.links.linkedin} 
                     className="text-blue-600 hover:text-blue-800 font-medium text-sm" 
                     target="_blank" 
                     rel="noopener noreferrer">
                     LinkedIn Profile
                  </a>
                  <span className="text-gray-400">•</span>
                  <a href={personalData.links.github} 
                     className="text-blue-600 hover:text-blue-800 font-medium text-sm" 
                     target="_blank" 
                     rel="noopener noreferrer">
                     GitHub Profile
                  </a>
                  <span className="text-gray-400">•</span>
                  <a href={personalData.links.codolio} 
                     className="text-blue-600 hover:text-blue-800 font-medium text-sm" 
                     target="_blank" 
                     rel="noopener noreferrer">
                     Codolio Portfolio
                  </a>
                </div>
              </div>
            </div>
          </div>
          
          {/* Quick Stats */}
          <div className="max-w-4xl mx-auto mt-16">
            <h3 className="text-2xl font-bold text-center text-gray-900 mb-8">Resume Highlights</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-md text-center border border-gray-200">
                <div className="w-12 h-12 bg-blue-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-blue-600 text-xl">💼</span>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Experience</h4>
                <p className="text-gray-600 text-sm">{personalData.resumeHighlights.experience}</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md text-center border border-gray-200">
                <div className="w-12 h-12 bg-green-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-green-600 text-xl">🎓</span>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Education</h4>
                <p className="text-gray-600 text-sm">{personalData.resumeHighlights.education}</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md text-center border border-gray-200">
                <div className="w-12 h-12 bg-purple-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-purple-600 text-xl">⚡</span>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Skills</h4>
                <p className="text-gray-600 text-sm">{personalData.resumeHighlights.skills}</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md text-center border border-gray-200">
                <div className="w-12 h-12 bg-yellow-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-yellow-600 text-xl">🏆</span>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Projects</h4>
                <p className="text-gray-600 text-sm">{personalData.resumeHighlights.projects}</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  )
}