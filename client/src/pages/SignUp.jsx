import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { clearUIState } from "../redux/features/ui/uiSlice.js";
import { signUpUser } from "../redux/features/user/userSlice.js";
import GoogleOAuth from "../components/GoogleOAuth.jsx";

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const resultAction = await dispatch(signUpUser(formData));

    // Access the `payload` directly and check success
    if (signUpUser.fulfilled.match(resultAction)) {
      const { success } = resultAction.payload;
      if (success) {
        navigateAfterSignup();
      }
    }
  };

  const isDisabled =
    !formData.acceptedTerms || !formData.acceptedPrivacy || loading;

  const navigateAfterSignup = () => {
    setTimeout(() => {
      dispatch(clearUIState());
      navigate("/login");
    }, 1000);
  };

  // Show error and clear after delay
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
      <div className="bg-dark-blue min-h-[30vh]"></div>

      {/* Container with lines and content */}
      <div className="flex items-center h-0 space-x-4">
        <div className="flex-1 h-0.5 bg-white-ln z-5"></div>
        <span className="text-white-txt text-4xl tablet:text-6xl capitalize z-5">
          Sign Up
        </span>
        <div className="flex-1 h-0.5 bg-white-ln z-5"></div>
      </div>

      {/* Orange Box with form inside */}
      <div className="bg-orange-bg w-[90vw] tablet:w-[95vw] max-w-2xl rounded-xl shadow-lg pt-24 pb-4 px-8 -mt-28 absolute left-1/2 transform -translate-x-1/2">
        {/* Form content */}
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 w-full mt-16"
        >
          <input
            type="text"
            id="username"
            autoComplete="username"
            placeholder="Username"
            className="bg-white-bg w-full rounded-lg p-2 italic text-sm tablet:text-base pl-4"
            onChange={handleChange}
            required
          />
          <input
            type="email"
            id="email"
            autoComplete="email"
            placeholder="Email address"
            className="bg-white-bg w-full rounded-lg p-2 italic text-sm tablet:text-base pl-4"
            onChange={handleChange}
            required
          />
          <input
            type="password"
            id="password"
            autoComplete="new-password"
            placeholder="Password"
            className="bg-white-bg w-full rounded-lg p-2 italic text-sm tablet:text-base pl-4"
            onChange={handleChange}
            required
          />

          {/* Terms and Privacy */}
          <div className="flex items-start text-white-txt gap-2 text-sm">
            <input
              type="checkbox"
              id="acceptedTerms"
              checked={formData.acceptedTerms || false}
              onChange={handleChange}
              required
            />
            <label htmlFor="acceptedTerms">
              I accept the
              <Link
                to="/terms"
                className="hover:text-dark-blue underline ml-1"
                target="_blank"
                rel="noopener noreferrer"
              >
                general terms of service & conditions of use
              </Link>
            </label>
          </div>

          <div className="flex items-start text-white-txt gap-2 text-sm">
            <input
              type="checkbox"
              id="acceptedPrivacy"
              checked={formData.acceptedPrivacy || false}
              onChange={handleChange}
              required
            />
            <label htmlFor="acceptedPrivacy">
              I accept the
              <Link
                to="/privacy"
                className="hover:text-dark-blue underline ml-1"
                target="_blank"
                rel="noopener noreferrer"
              >
                privacy policy
              </Link>
            </label>
          </div>

          {error && (
            <p className="text-white-txt bg-orange-txt text-center py-2 px-6 rounded-lg mt-3 text-sm">
              {message || "Something went wrong"}
            </p>
          )}
          {success && (
            <p className="text-white-txt bg-orange-txt text-center py-2 px-6 rounded-lg mt-3 text-sm">
              {message || "Success!"}
            </p>
          )}

          <button
            disabled={isDisabled}
            type="submit"
            className={`bg-slate-800 hover:opacity-90 hover:text-orange-bg w-full rounded-lg text-white-txt font-bold uppercase text-sm tablet:text-base p-1 mt-3 transition-opacity ${
              isDisabled
                ? "opacity-50 cursor-not-allowed"
                : "opacity-100 cursor-pointer"
            }`}
          >
            {loading ? "Loading..." : "Sign Up"}
          </button>
        </form>

        {/* Divider: Overlapping bottom edge slightly */}
        <div className="flex items-center w-full mt-1 mb-1">
          <div className="flex-1 h-[0.005rem] bg-slate-400" />
          <span className="px-2 text-slate-400 text-sm capitalize">or</span>
          <div className="flex-1 h-[0.005rem] bg-slate-400" />
        </div>

        {/* Google OAuth */}
        <GoogleOAuth />

        <div className="flex gap-2 mt-1 justify-center text-sm pb-4">
          <p>Already have an account? </p>
          <Link to="/login">
            <span className="text-light-blue hover:text-slate-400">Log In</span>
          </Link>
        </div>
      </div>
      <div className="bg-light-blue min-h-[70vh]"></div>
    </section>
  );
}
