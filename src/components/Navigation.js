import Link from 'next/link'
import { useRouter } from 'next/router'

const Navigation = () => {
  const router = useRouter()
  
  const navItems = [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About' },
    { href: '/experience', label: 'Experience' },
    { href: '/projects', label: 'Projects' },
    { href: '/hackathons', label: 'Hackathons' },
    { href: '/publications', label: 'Publications' },
    { href: '/resume', label: 'Resume' },
    { href: '/contact', label: 'Contact' }
  ]

  const isActive = (href) => {
    return router.pathname === href
  }

  return (
    <nav className="fixed top-0 left-0 w-full bg-white shadow-md z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="logo">
            <Link href="/" className="text-2xl font-bold text-blue-600 cursor-pointer">
              Portfolio
            </Link>
          </div>
          <ul className="flex space-x-4 md:space-x-8">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`font-medium transition-all duration-300 ${
                    isActive(item.href)
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-800 hover:text-blue-600'
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  )
}

export default Navigation
