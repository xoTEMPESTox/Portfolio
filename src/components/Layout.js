import Navigation from './Navigation'
import Head from 'next/head'

const Layout = ({ children, title = 'Portfolio - Priyanshu Sah' }) => {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta charSet="UTF-8" />
      </Head>
      <div className="bg-gray-50 min-h-screen">
        <Navigation />
        <main>
          {children}
        </main>
      </div>
    </>
  )
}

export default Layout