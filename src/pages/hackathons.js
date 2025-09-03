import Layout from '../components/Layout'
import hackathonsData from '../data/hackathons.json'

export default function Hackathons() {
  return (
    <Layout title="Hackathons & Awards - Portfolio">
      {/* Hackathons Section */}
      <section id="hackathons" className="pt-24 pb-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold text-center text-gray-900 mb-16">My Hackathons</h1>
          
          <div className="max-w-4xl mx-auto space-y-8">
            {hackathonsData.hackathons.map((hackathon) => (
              <div key={hackathon.id} className="bg-white p-8 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-all duration-300">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex-grow">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">{hackathon.name}</h2>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                      <div className="flex items-center">
                        <span className="font-semibold mr-2">📅 Date:</span>
                        <span>{hackathon.date}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="font-semibold mr-2">👥 Role:</span>
                        <span>{hackathon.role}</span>
                      </div>
                    </div>
                  </div>
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center ml-6">
                    <span className="text-2xl">{hackathon.icon}</span>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <p className="font-semibold text-gray-900 mb-2">Description:</p>
                    <p className="text-gray-700 leading-relaxed">
                      {hackathon.description}
                    </p>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 mb-2">Achievements:</p>
                    <p className="text-gray-700 leading-relaxed">
                      {hackathon.achievements}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            
            {/* Add more hackathons placeholder */}
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 text-center">
              <p className="text-gray-600 italic">{hackathonsData.placeholders.hackathons}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Awards Section */}
      <section id="awards" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold text-center text-gray-900 mb-16">My Awards</h1>
          
          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
            {hackathonsData.awards.map((award) => (
              <div key={award.id} className="bg-white p-6 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-all duration-300">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-grow">
                    <h2 className="text-xl font-bold text-gray-900 mb-2">{award.name}</h2>
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-center">
                        <span className="font-semibold mr-2">📅 Date:</span>
                        <span>{award.date}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="font-semibold mr-2">🏢 Organization:</span>
                        <span>{award.organization}</span>
                      </div>
                    </div>
                  </div>
                  <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center ml-4">
                    <span className="text-xl">{award.icon}</span>
                  </div>
                </div>
                <div>
                  <p className="font-semibold text-gray-900 mb-2">Description:</p>
                  <p className="text-gray-700 leading-relaxed text-sm">
                    {award.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
          
          {/* Add more awards placeholder */}
          <div className="max-w-4xl mx-auto mt-8">
            <div className="bg-white p-6 rounded-lg border border-gray-200 text-center">
              <p className="text-gray-600 italic">{hackathonsData.placeholders.awards}</p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  )
}