import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { signupApi } from "../api/authApi.js";
import { useNotificationStore } from "../store/notificationStore.js";
import Notification from "../components/Notification.jsx";
import Loading from "../components/Loading.jsx";
import { useState } from "react";
import GoogleOAuth from "../components/GoogleOAuth.jsx";

export default function SignUp() {
  const navigate = useNavigate();
  const { setNotification, clearNotification } = useNotificationStore();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    acceptedTerms: false,
    acceptedPrivacy: false,
  });

  const { mutate: signup, isPending } = useMutation({
    mutationFn: signupApi,
    onSuccess: (data) => {
      setNotification("success", data.message || "Signed up successfully");

      setTimeout(() => {
        clearNotification();
        navigate("/login");
      }, 1500); 
    },
    onError: (error) => {
      setNotification("error", error.message);
    },
  });

  const isDisabled = !formData.acceptedTerms || !formData.acceptedPrivacy;

  const handleChange = (e) => {
    const { name, type, checked, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    signup(formData);
  };

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
            name="username"
            value={formData.username}
            autoComplete="username"
            placeholder="Username"
            className="bg-white-bg w-full rounded-lg p-2 italic text-sm tablet:text-base pl-4"
            onChange={handleChange}
            autoFocus
            required
          />
          <input
            type="email"
            name="email"
            value={formData.email}
            autoComplete="email"
            placeholder="Email address"
            className="bg-white-bg w-full rounded-lg p-2 italic text-sm tablet:text-base pl-4"
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            value={formData.password}
            autoComplete="current-password"
            placeholder="Password"
            className="bg-white-bg w-full rounded-lg p-2 italic text-sm tablet:text-base pl-4"
            onChange={handleChange}
            required
          />

          {/* Terms and Privacy */}
          <div className="flex items-start text-white-txt gap-2 text-sm">
            <input
              type="checkbox"
              name="acceptedTerms"
              checked={formData.acceptedTerms}
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
              name="acceptedPrivacy"
              checked={formData.acceptedPrivacy}
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

          <Notification />

          <button
            disabled={isDisabled}
            type="submit"
            className={`bg-slate-800 hover:opacity-90 hover:text-orange-bg w-full rounded-lg text-white-txt font-bold uppercase text-sm tablet:text-base p-1 mt-3 transition-opacity ${
              isDisabled
                ? "opacity-50 cursor-not-allowed"
                : "opacity-100 cursor-pointer"
            }`}
          >
            {isPending ? <Loading color="white" size={24} /> : "Sign Up"}
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
