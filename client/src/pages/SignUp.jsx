import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { clearUIState } from "../redux/features/ui/uiSlice.js";
import { signUpUser } from "../redux/features/user/userSlice.js";

export default function SignUp() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, success, error, message } = useSelector((state) => state.ui);
  const [formData, setFormData] = useState({});

  const handleChange = (e) => {
    const { id, type, value, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(signUpUser(formData));
  };

  const isDisabled =
    !formData.acceptedTerms || !formData.acceptedPrivacy || loading;

  // Show message, then navigate after message clears
  useEffect(() => {
    if (success) {
      const timeout = setTimeout(() => {
        dispatch(clearUIState());
        navigate("/login");
      }, 3000);

      return () => clearTimeout(timeout);
    }
  }, [success, dispatch, navigate]);

  // Show error and clear after 3s
  useEffect(() => {
    if (error) {
      const timeout = setTimeout(() => {
        dispatch(clearUIState());
      }, 3000);
      return () => clearTimeout(timeout);
    }
  }, [error, dispatch]);

  return (
    <section>
      <div className="bg-dark-blue min-h-[20vh]"></div>

      {/* Container with lines and content */}
      <div className="flex items-center h-0 space-x-4">
        <div className="flex-1 h-0.5 bg-white-ln z-10"></div>
        <span className="text-white-txt text-3xl tablet:text-5xl capitalize z-10">
          Sign Up
        </span>
        <div className="flex-1 h-0.5 bg-white-ln z-10"></div>
      </div>

      {/* Orange Box with form inside */}
      <div className="bg-orange-bg w-[90vw] max-w-md rounded-xl shadow-lg -mt-25 pt-16 pb-0 px-6 absolute left-1/2 transform -translate-x-1/2">
        {/* Form content */}
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-3 w-full mt-20"
        >
          <input
            type="text"
            id="username"
            autoComplete="username"
            placeholder="Username"
            className="bg-white-ln p-1 rounded-lg text-[0.75rem] tablet:text-sm italic"
            onChange={handleChange}
            required
          />
          <input
            type="email"
            id="email"
            autoComplete="email"
            placeholder="Email address"
            className="bg-white-ln p-1 rounded-lg text-[0.75rem] tablet:text-sm italic"
            onChange={handleChange}
            required
          />
          <input
            type="password"
            id="password"
            autoComplete="new-password"
            placeholder="Password"
            className="bg-white-ln p-1 rounded-lg text-[0.75rem] tablet:text-sm italic"
            onChange={handleChange}
            required
          />

          {/* Terms and Privacy */}
          <div className="flex items-start text-white-txt gap-1 text-[0.6rem] tablet:text-xs">
            <input
              type="checkbox"
              id="acceptedTerms"
              checked={formData.acceptedTerms || false}
              onChange={handleChange}
              required
            />
            <label htmlFor="terms">
              I accept the
              <Link to="/terms" className="hover:text-dark-blue underline ml-1">
                general terms of service & conditions of use
              </Link>
            </label>
          </div>

          <div className="flex items-start text-white-txt gap-1 text-[0.6rem] tablet:text-xs">
            <input
              type="checkbox"
              id="acceptedPrivacy"
              checked={formData.acceptedPrivacy || false}
              onChange={handleChange}
              required
            />
            <label htmlFor="privacy">
              I accept the
              <Link
                to="/privacy"
                className="hover:text-dark-blue underline ml-1"
              >
                privacy policy
              </Link>
            </label>
          </div>

          {error && (
            <p className="text-white  bg-orange-txt px-2 py-2 rounded-lg mt-2 text-center">
              {message || "Something went wrong"}
            </p>
          )}
          {success && (
            <p className="text-white bg-orange-txt px-4 py-2 rounded-lg mt-2 text-center">
              {message || "Success!"}
            </p>
          )}

          <button
            disabled={isDisabled}
            type="submit"
            className={`bg-slate-800 text-white text-[0.75rem] tablet:text-xs p-1 rounded-lg hover:text-orange-bg uppercase transition-opacity ${
              isDisabled ? "opacity-50 cursor-not-allowed" : "opacity-100"
            }`}
          >
            {loading ? "Loading..." : "Sign Up"}
          </button>
        </form>

        {/* Divider: Overlapping bottom edge slightly */}
        <div className="flex items-center w-full mt-1/2 mb-1/2">
          <div className="flex-1 h-[0.005rem] bg-white-ln" />
          <span className="px-2 text-white-txt text-xs capitalize">or</span>
          <div className="flex-1 h-[0.005rem] bg-white-ln" />
        </div>

        {/* Google Sign-in Button */}
        <button
          disabled={isDisabled}
          type="button"
          className={`bg-green-900 text-white text-[0.75rem] tablet:text-xs w-full rounded-lg hover:text-orange-bg p-1 uppercase hover:opacity-90 mb-2 transition-opacity ${
            isDisabled ? "opacity-70 cursor-not-allowed" : "opacity-100"
          }`}
        >
          Continue with Google
        </button>

        <div className="flex gap-2 mt-2 mb-2 justify-center text-[0.75rem] tablet:text-xs">
          <p>Already have an account? </p>
          <Link to="/login">
            <span className="text-blue-500">Log In</span>
          </Link>
        </div>
      </div>
      <div className="bg-light-blue min-h-[80vh]"></div>
    </section>
  );
}
