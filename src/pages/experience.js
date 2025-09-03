import Layout from '../components/Layout'
import experienceData from '../data/experience.json'

export default function Experience() {
  return (
    <Layout title="Work Experience - Portfolio">
      {/* Work Experience Section */}
      <section id="experience" className="pt-24 pb-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold text-center text-gray-900 mb-16">Work Experience</h1>
          
          {/* Timeline */}
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Professional Journey</h2>
            <p className="text-center text-gray-600 mb-12 italic">
              {experienceData.note}
            </p>
            
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-blue-200"></div>
              
              {/* Timeline Items */}
              {experienceData.workExperience.map((job) => (
                <div key={job.id} className="relative mb-12">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center shadow-lg relative z-10">
                      <span className="text-white font-bold">{job.id}</span>
                    </div>
                    <div className="ml-8 flex-grow">
                      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">{job.title}</h3>
                        <p className="text-lg font-semibold text-blue-600 mb-2">{job.company}</p>
                        <p className="text-gray-600 font-medium mb-4">{job.period}</p>
                        <p className="text-gray-700 leading-relaxed">
                          {job.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Additional Experience Information */}
          <div className="max-w-4xl mx-auto mt-16">
            <div className="bg-gray-50 p-8 rounded-lg shadow-md">
              <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">{experienceData.additionalExperience.title}</h2>
              <p className="text-gray-700 leading-relaxed text-center">
                {experienceData.additionalExperience.description}
              </p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  )
}