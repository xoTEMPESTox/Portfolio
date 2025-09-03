import Layout from '../components/Layout'
import personalData from '../data/personal.json'
import skillsData from '../data/skills.json'

export default function About() {
  return (
    <Layout title="About Me - Portfolio">
      {/* About Section */}
      <section id="about" className="pt-24 pb-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold text-center text-gray-900 mb-16">About Me</h1>
          
          <div className="max-w-6xl mx-auto">
            {/* Photo and Intro */}
            <div className="flex flex-col lg:flex-row items-center gap-12 mb-16">
              <div className="lg:w-1/3">
                <div className="photo-placeholder bg-gray-100 rounded-full w-64 h-64 mx-auto flex items-center justify-center shadow-lg">
                  <div className="text-center">
                    <div className="w-32 h-32 bg-blue-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                      <span className="text-4xl text-blue-600">PS</span>
                    </div>
                    <p className="text-sm text-gray-600 italic">Photo placeholder</p>
                  </div>
                </div>
              </div>
              
              <div className="lg:w-2/3">
                <div className="bio space-y-6">
                  <h2 className="text-3xl font-bold text-gray-900 mb-6">My Bio</h2>
                  <div className="space-y-4 text-gray-600 leading-relaxed">
                    {personalData.bio.map((paragraph, index) => (
                      <p key={index} className="text-lg">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Skills Section */}
            <div className="bg-gray-50 rounded-lg p-8 shadow-md">
              <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">My Skills</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {skillsData.skills.map((skill, index) => (
                  <div key={index} className="skill-item p-4 bg-white rounded-lg shadow-sm">
                    <h3 className="font-semibold text-blue-600 mb-2">{skill.category}</h3>
                    <p className="text-gray-600">{skill.technologies}</p>
                  </div>
                ))}
              </div>
              <div className="text-center mt-8">
                <p className="text-gray-500 italic">{skillsData.note}</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  )
}