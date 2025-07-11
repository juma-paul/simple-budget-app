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
  console.log(formData);
  useEffect(() => {
    let timeout;
    if (success || error) {
      timeout = setTimeout(() => {
        dispatch(clearUIState());
      }, 4000); // 4 seconds
    }

    return () => clearTimeout(timeout);
  }, [success, error, dispatch]);

  useEffect(() => {
    if (success) navigate("/login");
  }, [success, navigate]);

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
            placeholder="Username"
            id="username"
            className="bg-white-ln p-1 rounded-lg text-[0.75rem] tablet:text-sm"
            onChange={handleChange}
            required
          />
          <input
            type="email"
            placeholder="Email address"
            id="email"
            className="bg-white-ln p-1 rounded-lg text-[0.75rem] tablet:text-sm"
            onChange={handleChange}
            required
          />
          <input
            type="password"
            placeholder="Password"
            id="password"
            className="bg-white-ln p-1 rounded-lg text-[0.75rem] tablet:text-sm"
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

          <button
            disabled={isDisabled}
            type="submit"
            className="bg-slate-700 text-white text-[0.75rem] tablet:text-xs p-1 rounded-lg uppercase hover:text-orange-400"
          >
            {loading ? "Loading..." : "Sign Up"}
          </button>
        </form>

        {/* Divider: Overlapping bottom edge slightly */}
        <div className="flex items-center w-full mt-1 mb-1">
          <div className="flex-1 h-px bg-white-ln" />
          <span className="px-2 text-white-txt text-sm capitalize">or</span>
          <div className="flex-1 h-px bg-white-ln" />
        </div>

        {/* Google Sign-in Button */}
        <button
          disabled={isDisabled}
          type="button"
          className="bg-green-700 text-white text-[0.75rem] tablet:text-xs w-full rounded-lg p-1 uppercase hover:opacity-90 mb-2"
        >
          Continue with Google
        </button>
        <p className="text-error mt-2">{error && message}</p>
        <p className="text-success mt-2">{success && message}</p>

        <div className="flex gap-2 mt-2 mb-2 justify-center text-[0.75rem] tablet:text-xs">
          <p>Already have an account? </p>
          <Link to="/login">
            <span className="text-dark-blue">Log In</span>
          </Link>
        </div>
      </div>
      <div className="bg-light-blue min-h-[80vh]"></div>
    </section>
  );
}
