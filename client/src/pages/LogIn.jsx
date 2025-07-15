import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logInUser } from "../redux/features/user/userSlice.js";
import { clearUIState } from "../redux/features/ui/uiSlice.js";

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
      }, 500);

      return () => clearTimeout(timeout);
    }
  }, [success, dispatch, navigate]);

  useEffect(() => {
    if (error) {
      const timeout = setTimeout(() => {
        dispatch(clearUIState());
      }, 600);
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
          Welcome Back
        </span>
        <div className="flex-1 h-0.5 bg-white-ln z-10"></div>
      </div>

      {/* Orange Box with form inside */}
      <div className="bg-orange-bg w-[90vw] max-w-md rounded-xl shadow-lg  pt-16 pb-0 px-6 -mt-20 absolute left-1/2 transform -translate-x-1/2">
        <form onSubmit={handleSubmit} className=" flex flex-col gap-3 mt-15">
          <input
            type="text"
            id="identifier"
            autoComplete="identifier"
            placeholder="Email or Username"
            className="bg-white-bg w-full rounded-lg p-1 italic text-[0.75rem] tablet:text-sm pl-4"
            onChange={handleChange}
            required
          />
          <input
            type="password"
            id="password"
            autoComplete="password"
            placeholder="Password"
            className="bg-white-bg w-full rounded-lg p-1 italic text-xs tablet:text-sm pl-4"
            onChange={handleChange}
            required
          />

          {error && (
            <p className="text-white-txt bg-orange-txt text-center py-2 px-4 rounded-lg mt-2">
              {message || "Something went wrong"}
            </p>
          )}

          {success && (
            <p className="text-white-txt bg-orange-txt text-center py-2 px-4 rounded-lg mt-2">
              {message || "Login successful!"}
            </p>
          )}

          <button
            type="submit"
            className="bg-slate-800 hover:opacity-90 hover:text-orange-bg w-full rounded-lg text-white-txt font-bold uppercase text-xs tablet:text-sm p-[0.25rem]"
          >
            {loading ? "Loading..." : "Log In"}
          </button>
        </form>

        {/* Divider: Overlapping bottom edge slightly */}
        <div className="flex items-center w-full mt-1/2 mb-1/2">
          <div className="flex-1 h-[0.005rem] bg-slate-400" />
          <span className="px-2 text-slate-400 text-xs capitalize">or</span>
          <div className="flex-1 h-[0.005rem] bg-slate-400" />
        </div>

        {/* Google navigation placeholder */}
        <button className="bg-green-900 hover:opacity-90 hover:text-orange-bg w-full rounded-lg text-white-txt font-bold uppercase text-xs tablet:text-sm p-[0.25rem] mb-2">
          continue with google
        </button>

        <p className="text-center text-xs pb-2">
          Not signed up?{" "}
          <Link to="/signup" className="text-light-blue hover:text-slate-400">
            Sign Up
          </Link>
        </p>
        <p className="text-center text-xs text-light-blue hover:text-slate-400 pb-4">
          Forgot Password?
        </p>
      </div>
      <div className="bg-light-blue min-h-[80vh]"></div>
    </section>
  );
}
