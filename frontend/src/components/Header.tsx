import { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

interface AuthContextType {
  user: { username: string } | null;
  logoutUser: () => void;
}

const Header = () => {
  const auth = useContext(AuthContext) as AuthContextType;
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const menuItems = auth.user ? [
    { label: 'Home', path: '/' },
    { label: `Hello ${auth.user.username}`, path: '#', isText: true },
    { label: 'Cart', path: `/cart/${auth.user.username}/` },
    { label: 'Auctions', path: '/products/auctions/' },
    { label: 'My Profile', path: `/owner/${auth.user.username}/` },
    { label: 'Logout', onClick: auth.logoutUser, isButton: true }
  ] : [
    { label: 'Home', path: '/' },
    { label: 'Login', path: '/login/' }
  ];

  return (
    <header className="bg-gradient-to-r from-blue-400 to-blue-900 text-white shadow-lg">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-xl font-bold">Home</Link>
          
          {/* Desktop Menu Items - Hidden on small devices */}
          <div className="hidden md:flex flex-grow items-center justify-center space-x-4">
            {auth.user && (
              <span className="text-lg font-bold">{`Hello ${auth.user.username}`}</span>
            )}
            <Link to={`/products/auctions/`} className="hover:text-yellow-400 transition-colors">Auctions</Link>
            <Link to={`/cart/${auth?.user?.username}/`} className="hover:text-yellow-400 transition-colors">Cart</Link>
            <Link to={`/owner/${auth?.user?.username}/`} className="hover:text-yellow-400 transition-colors">My Profile</Link>
          </div>

          {/* Logout Button - Hidden on small devices */}
          <button onClick={auth.logoutUser} className="hover:text-yellow-400 transition-colors hidden md:block">
            Logout
          </button>

          {/* Mobile Menu Button */}
          <button onClick={toggleMenu} className="md:hidden focus:outline-none focus:ring-2 focus:ring-yellow-300 rounded-md p-2">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <nav className="md:hidden">
            <ul className="flex flex-col space-y-2 mt-2">
              {menuItems.map((item, index) => (
                <li key={index}>
                  {item.isButton ? (
                    <button onClick={item.onClick} className="w-full text-left hover:text-yellow-400 transition-colors">
                      {item.label}
                    </button>
                  ) : item.isText ? (
                    <span className="font-semibold">{item.label}</span>
                  ) : (
                    <Link to={item.path || ''} className="block hover:text-yellow-400 transition-colors">
                      {item.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </nav>
        )}
      </div>
    </header>
  );
}

export default Header;