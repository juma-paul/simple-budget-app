import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logInUser } from "../redux/features/user/userSlice.js";
import { clearUIState } from "../redux/features/ui/uiSlice.js";
import GoogleOAuth from "../components/GoogleOAuth.jsx";

export default function LogIn() {
  const [formData, setFormData] = useState({});
  const { loading, error, success, message } = useSelector((state) => state.ui);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(logInUser(formData));
  };

  useEffect(() => {
    if (success) {
      const timeout = setTimeout(() => {
        dispatch(clearUIState());
        navigate("/dashboard");
      }, 1000);

      return () => clearTimeout(timeout);
    }
  }, [success, dispatch, navigate]);

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
          Welcome Back
        </span>
        <div className="flex-1 h-0.5 bg-white-ln z-5"></div>
      </div>

      {/* Orange Box with form inside */}
      <div className="bg-orange-bg w-[95vw] max-w-2xl rounded-xl shadow-lg pt-24 pb-4 px-8 -mt-28 absolute left-1/2 transform -translate-x-1/2">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-16">
          <input
            type="text"
            id="identifier"
            autoComplete="identifier"
            placeholder="Email or Username"
            className="bg-white-bg w-full rounded-lg p-2 italic text-sm tablet:text-base pl-4"
            onChange={handleChange}
            required
          />
          <input
            type="password"
            id="password"
            autoComplete="password"
            placeholder="Password"
            className="bg-white-bg w-full rounded-lg p-2 italic text-sm tablet:text-base pl-4"
            onChange={handleChange}
            required
          />

          {error && (
            <p className="text-white-txt bg-orange-txt text-center py-2 px-6 rounded-lg mt-3 text-sm">
              {message || "Something went wrong"}
            </p>
          )}

          {success && (
            <p className="text-white-txt bg-orange-txt text-center py-2 px-6 rounded-lg mt-3 text-sm">
              {message || "Login successful!"}
            </p>
          )}

          <button
            type="submit"
            className="bg-slate-800 hover:opacity-90 hover:text-orange-bg w-full rounded-lg text-white-txt font-bold uppercase cursor-pointer text-sm tablet:text-base p-1 mt-3"
          >
            {loading ? "Loading..." : "Log In"}
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

        <p className="text-center text-sm pb-3">
          Not signed up?{" "}
          <Link to="/signup" className="text-light-blue hover:text-slate-400">
            Sign Up
          </Link>
        </p>
        <p className="text-center text-sm text-light-blue hover:text-slate-400 pb-4">
          Forgot Password?
        </p>
      </div>
      <div className="bg-light-blue min-h-[70vh]"></div>
    </section>
  );
}
