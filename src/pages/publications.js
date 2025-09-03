import Layout from '../components/Layout'
import publicationsData from '../data/publications.json'

export default function Publications() {
  return (
    <Layout title="Publications & Blogs - Portfolio">
      {/* Blogs Section */}
      <section id="blogs" className="pt-24 pb-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold text-center text-gray-900 mb-16">My Blogs</h1>
          
          <div className="max-w-4xl mx-auto space-y-8">
            {publicationsData.blogs.map((blog) => (
              <div key={blog.id} className="bg-white p-6 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-all duration-300">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-grow">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">{blog.title}</h2>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
                      <div className="flex items-center">
                        <span className="font-semibold mr-2">📅 Date:</span>
                        <span>{blog.date}</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {blog.tags.map((tag, index) => (
                        <span key={index} className={`px-3 py-1 text-xs rounded-full ${
                          tag === 'Technology' ? 'bg-blue-100 text-blue-800' :
                          tag === 'Programming' ? 'bg-green-100 text-green-800' :
                          tag === 'Web Development' ? 'bg-purple-100 text-purple-800' :
                          tag === 'AI/ML' ? 'bg-red-100 text-red-800' :
                          tag === 'Data Science' ? 'bg-yellow-100 text-yellow-800' :
                          tag === 'Python' ? 'bg-indigo-100 text-indigo-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center ml-6">
                    <span className="text-xl">{blog.icon}</span>
                  </div>
                </div>
                <div className="mb-6">
                  <p className="font-semibold text-gray-900 mb-2">Summary:</p>
                  <p className="text-gray-700 leading-relaxed">
                    {blog.summary}
                  </p>
                </div>
                <a href={blog.url} 
                   className="btn btn-primary" 
                   target="_blank" 
                   rel="noopener noreferrer">
                  Read Full Post
                </a>
              </div>
            ))}
            
            {/* Add more blogs placeholder */}
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 text-center">
              <p className="text-gray-600 italic">{publicationsData.placeholders.blogs}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Publications Section */}
      <section id="publications" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold text-center text-gray-900 mb-16">My Publications</h1>
          
          <div className="max-w-4xl mx-auto space-y-8">
            {publicationsData.publications.map((publication) => (
              <div key={publication.id} className="bg-white p-6 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-all duration-300">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-grow">
                    <h2 className="text-2xl font-bold text-gray-900 mb-3">{publication.title}</h2>
                    <div className="space-y-2 text-sm text-gray-600 mb-4">
                      <div className="flex items-center">
                        <span className="font-semibold mr-2">📅 Date:</span>
                        <span>{publication.date}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="font-semibold mr-2">📖 Published in:</span>
                        <span>{publication.publishedIn}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="font-semibold mr-2">👥 Co-authors:</span>
                        <span>{publication.coAuthors}</span>
                      </div>
                    </div>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center ml-6">
                    <span className="text-xl">{publication.icon}</span>
                  </div>
                </div>
                <div className="mb-6">
                  <p className="font-semibold text-gray-900 mb-2">Abstract:</p>
                  <p className="text-gray-700 leading-relaxed">
                    {publication.abstract}
                  </p>
                </div>
                <a href={publication.url} 
                   className="btn btn-primary" 
                   target="_blank" 
                   rel="noopener noreferrer">
                  View Publication
                </a>
              </div>
            ))}
            
            {/* Add more publications placeholder */}
            <div className="bg-white p-6 rounded-lg border border-gray-200 text-center">
              <p className="text-gray-600 italic">{publicationsData.placeholders.publications}</p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  )
}