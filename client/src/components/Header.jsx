import { Link } from "react-router-dom";
import { useState } from "react";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="bg-dark-blue h-12 tablet:h-14 laptop:h-16 fixed top-0 left-0 right-0 z-50">
      <div className="flex items-center justify-between h-full px-4 tablet:px-6 laptop:px-8 max-w-6xl mx-auto z-51">
        <Link to="/">
          <img
            src="/src/assets/SBA_Logo.png"
            alt="Logo"
            className="h-6 tablet:h-8 laptop:h-10"
          />
        </Link>

        {/* Desktop Navigation */}
        <ul className="hidden tablet:flex items-center text-black text-xs space-x-2 laptop:space-x-3 desktop:space-x-4">
          <Link
            to="/about"
            className="hover:opacity-80 transition-opacity hover:text-orange-txt"
          >
            <li className="bg-white-bg px-1.5 py-1 laptop:px-2.5 laptop:py-1.5 desktop:px-3 desktop:py-1.5 rounded-full font-medium whitespace-nowrap">
              About Us
            </li>
          </Link>
          <Link
            to="/reviews"
            className="hover:opacity-80 transition-opacity hover:text-orange-txt"
          >
            <li className="bg-white-bg px-1.5 py-1 laptop:px-2.5 laptop:py-1.5 desktop:px-3 desktop:py-1.5 rounded-full font-medium">
              Reviews
            </li>
          </Link>
          <Link
            to="/signup"
            className="hover:opacity-80 transition-opacity hover:text-orange-txt"
          >
            <li className="bg-white-bg px-1.5 py-1 laptop:px-2.5 laptop:py-1.5 desktop:px-3 desktop:py-1.5 rounded-full font-medium whitespace-nowrap">
              Sign Up
            </li>
          </Link>
          <Link
            to="/login"
            className="hover:opacity-80 transition-opacity hover:text-orange-txt"
          >
            <li className="bg-white-bg px-1.5 py-1 laptop:px-2.5 laptop:py-1.5 desktop:px-3 desktop:py-1.5 rounded-full font-medium whitespace-nowrap">
              Log In
            </li>
          </Link>
        </ul>

        {/* Mobile Login + Hamburger */}
        <div className="tablet:hidden flex items-center space-x-3">
          <Link to="/login" className="hover:opacity-80 transition-opacity">
            <span className="text-black text-xs px-2 py-1 font-bold bg-white-bg rounded-full hover:text-orange-txt whitespace-nowrap">
              Log In
            </span>
          </Link>
          <div className="w-px h-4 bg-white-bg opacity-50"></div>
          <button
            className="flex flex-col justify-center items-center w-6 h-6 space-y-1 group"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            <div className="w-5 h-0.5 bg-white-bg group-hover:bg-gray-200 transition-colors"></div>
            <div className="w-5 h-0.5 bg-white-bg group-hover:bg-gray-200 transition-colors"></div>
            <div className="w-5 h-0.5 bg-white-bg group-hover:bg-gray-200 transition-colors"></div>
          </button>
        </div>
      </div>

      {/* Mobile navigation menu */}
      {isMenuOpen && (
        <div className="tablet:hidden absolute top-full left-0 right-0 bg-dark-blue border-t border-white-ln">
          <ul className="flex flex-col text-white-bg space-y-4 p-4">
            <Link
              to="/about"
              onClick={toggleMenu}
              className="hover:opacity-70 transition-opacity hover:text-orange-txt"
            >
              <li className="text-sm font-normal whitespace-nowrap">
                About Us
              </li>
            </Link>
            <Link
              to="/reviews"
              onClick={toggleMenu}
              className="hover:opacity-70 transition-opacity hover:text-orange-txt"
            >
              <li className="text-sm font-normal">Reviews</li>
            </Link>
            <Link
              to="/signup"
              onClick={toggleMenu}
              className="hover:opacity-70 transition-opacity hover:text-orange-txt"
            >
              <li className="text-sm font-normal whitespace-nowrap">Sign Up</li>
            </Link>
          </ul>
        </div>
      )}
    </div>
  );
}
