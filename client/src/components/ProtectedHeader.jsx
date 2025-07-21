import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { logOutUser } from "../redux/features/user/userSlice.js";
import { clearUIState } from "../redux/features/ui/uiSlice.js";
import logo from "../assets/SBA_Logo.png";
import { useState } from "react";

export default function ProtectedHeader() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const currentUser = useSelector((state) => state.user.currentUser);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const onLogout = async () => {
    const resultAction = await dispatch(logOutUser());

    if (logOutUser.fulfilled.match(resultAction)) {
      const { success } = resultAction.payload;
      if (success && currentUser === null) {
        const timeout = setTimeout(() => {
          dispatch(clearUIState());
          navigate("/login");
        }, 300);

        return () => clearTimeout(timeout);
      }
    } else if (logOutUser.rejected.match(resultAction)) {
      const { error } = resultAction.payload;
      if (error) {
        console.error("Logout Error:", error);
        const timeout = setTimeout(() => {
          dispatch(clearUIState());
        }, 3000);

        return () => clearTimeout(timeout);
      }
    }
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <>
      {/* Header */}
      <div className="bg-dark-blue h-12 tablet:h-14 laptop:h-16 fixed left-0 right-0 z-40">
        <div className="flex items-center justify-between h-full px-4 tablet:px-6 laptop:px-8 max-w-6xl mx-auto">
          {/* Logo */}
          <Link to="/">
            <img src={logo} alt="Logo" className="h-6 tablet:h-8 laptop:h-10" />
          </Link>

          {/* Profile Picture & Settings(Logout, Profile) */}
          <div className="flex items-center gap-4 relative">
            <Link
              to="/profile"
              className="text-white-txt hover:text-orange-txt transition-colors"
              aria-label="Profile"
            >
              {/* User SVG */}
              <svg
                className="fill-white-txt w-4 tablet:w-5 laptop:w-6 h-4 tablet:h-5 laptop:h-6 hover:fill-gray-400"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 448 512"
              >
                <path d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512l388.6 0c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304l-91.4 0z" />
              </svg>
            </Link>

            {/* Gear/Settings Iconwith Dropdown */}
            <button
              className="text-white-txt hover:text-orange-txt transition-colors focus:outline-none"
              onClick={toggleDropdown}
              aria-label="Settings"
            >
              <svg
                className="fill-white-txt w-4 tablet:w-5 laptop:w-6 h-4 tablet:h-5 laptop:h-6 cursor-pointer hover:fill-gray-400"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
              >
                <path d="M495.9 166.6c3.2 8.7 .5 18.4-6.4 24.6l-43.3 39.4c1.1 8.3 1.7 16.8 1.7 25.4s-.6 17.1-1.7 25.4l43.3 39.4c6.9 6.2 9.6 15.9 6.4 24.6c-4.4 11.9-9.7 23.3-15.8 34.3l-4.7 8.1c-6.6 11-14 21.4-22.1 31.2c-5.9 7.2-15.7 9.6-24.5 6.8l-55.7-17.7c-13.4 10.3-28.2 18.9-44 25.4l-12.5 57.1c-2 9.1-9 16.3-18.2 17.8c-13.8 2.3-28 3.5-42.5 3.5s-28.7-1.2-42.5-3.5c-9.2-1.5-16.2-8.7-18.2-17.8l-12.5-57.1c-15.8-6.5-30.6-15.1-44-25.4L83.1 425.9c-8.8 2.8-18.6 .3-24.5-6.8c-8.1-9.8-15.5-20.2-22.1-31.2l-4.7-8.1c-6.1-11-11.4-22.4-15.8-34.3c-3.2-8.7-.5-18.4 6.4-24.6l43.3-39.4C64.6 273.1 64 264.6 64 256s.6-17.1 1.7-25.4L22.4 191.2c-6.9-6.2-9.6-15.9-6.4-24.6c4.4-11.9 9.7-23.3 15.8-34.3l4.7-8.1c6.6-11 14-21.4 22.1-31.2c5.9-7.2 15.7-9.6 24.5-6.8l55.7 17.7c13.4-10.3 28.2-18.9 44-25.4l12.5-57.1c2-9.1 9-16.3 18.2-17.8C227.3 1.2 241.5 0 256 0s28.7 1.2 42.5 3.5c9.2 1.5 16.2 8.7 18.2 17.8l12.5 57.1c15.8 6.5 30.6 15.1 44 25.4l55.7-17.7c8.8-2.8 18.6-.3 24.5 6.8c8.1 9.8 15.5 20.2 22.1 31.2l4.7 8.1c6.1 11 11.4 22.4 15.8 34.3zM256 336a80 80 0 1 0 0-160 80 80 0 1 0 0 160z" />
              </svg>
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute right-0 top-8 tablet:top-10 laptop:top-12 w-30 bg-white-txt rounded-md shadow-xl z-50">
                <div className="py-1">
                  <Link
                    to="/profile"
                    className="block px-4 py-2 w-full text-sm text-gray-700 hover:bg-white-bg hover:text-orange-txt transition-colors"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    Profile
                  </Link>

                  <button
                    onClick={() => {
                      onLogout();
                      setIsDropdownOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-error hover:bg-white-bg hover:font-extrabold transition-colors"
                  >
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
