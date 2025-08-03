import { Link } from "react-router-dom";
import { useState } from "react";
import logo from "../assets/SBA_Logo.png";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="bg-dark-blue h-14 tablet:h-16 laptop:h-18 fixed left-0 right-0 z-50">
      <div className="flex items-center justify-between h-full px-4 tablet:px-6 laptop:px-8 max-w-full mx-auto z-51">
        <Link to="/">
          <img src={logo} alt="Logo" className="h-10 laptop:h-12" />
        </Link>

        {/* Desktop Navigation */}
        <ul className="hidden tablet:flex items-center text-black text-xs space-x-4 laptop:space-x-5 desktop:space-x-6">
          <Link
            to="/about"
            className="hover:opacity-80 transition-opacity hover:text-orange-txt"
          >
            <li className="bg-white-bg px-2 py-1 laptop:px-3 laptop:py-2 desktop:px-4 desktop:py-2 rounded-full font-bold tablet:text-base whitespace-nowrap">
              About Us
            </li>
          </Link>
          <Link
            to="/reviews"
            className="hover:opacity-80 transition-opacity hover:text-orange-txt"
          >
            <li className="bg-white-bg px-2 py-1 laptop:px-3 laptop:py-2 desktop:px-4 desktop:py-2 rounded-full font-bold tablet:text-base whitespace-nowrap">
              Reviews
            </li>
          </Link>
          <Link
            to="/signup"
            className="hover:opacity-80 transition-opacity hover:text-orange-txt"
          >
            <li className="bg-white-bg px-2 py-1 laptop:px-3 laptop:py-2 desktop:px-4 desktop:py-2 rounded-full font-bold tablet:text-base whitespace-nowrap">
              Sign Up
            </li>
          </Link>
          <Link
            to="/login"
            className="hover:opacity-80 transition-opacity hover:text-orange-txt"
          >
            <li className="bg-white-bg px-2 py-1 laptop:px-3 laptop:py-2 desktop:px-4 desktop:py-2 rounded-full font-bold tablet:text-base whitespace-nowrap">
              Log In
            </li>
          </Link>
        </ul>

        {/* Mobile Login + Hamburger */}
        <div className="tablet:hidden flex items-center space-x-4">
          <Link to="/login" className="hover:opacity-80 transition-opacity">
            <span className="text-black text-lg px-2 py-1 font-extrabold bg-white-bg rounded-full hover:text-orange-txt whitespace-nowrap">
              Log In
            </span>
          </Link>
          <div className="w-px h-4 bg-white-bg opacity-50"></div>
          <button
            className="flex flex-col justify-center items-center w-8 h-8 space-y-1.5 group"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            <div className="w-8 h-0.5 bg-white-bg group-hover:bg-gray-200 transition-colors"></div>
            <div className="w-8 h-0.5 bg-white-bg group-hover:bg-gray-200 transition-colors"></div>
            <div className="w-8 h-0.5 bg-white-bg group-hover:bg-gray-200 transition-colors"></div>
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
