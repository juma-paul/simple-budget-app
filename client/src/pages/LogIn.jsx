import { Link, useNavigate } from "react-router-dom";
import GoogleOAuth from "../components/GoogleOAuth.jsx";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { loginApi } from "../api/authApi.js";
import { useAuthStore } from "../store/authStore.js";
import { useNotificationStore } from "../store/notificationStore.js";
import Loading from "../components/Loading.jsx";
import Notification from "../components/Notification.jsx";

export default function LogIn() {
  const setUser = useAuthStore((state) => state.setUser);
  const { setNotification, clearNotification } = useNotificationStore();

  // navigate
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ identifier: "", password: "" });

  const { mutate: login, isPending } = useMutation({
    mutationFn: loginApi,
    onSuccess: (data) => {
      if (data?.data) {
        setNotification("success", data.message || "Login successful!");
        setFormData({ identifier: "", password: "" });
        
        // Navigate to dashboard
        setTimeout(() => {
          setUser(data.data);
          clearNotification();
          navigate("/dashboard");
        }, 1500); 
      }
    },
    onError: (err) => {
      setNotification("error", err.message);
      setFormData((prev) => ({ ...prev, password: "" }));
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.identifier.trim() || !formData.password) {
      setNotification("error", "Please fill in all fields");
      return;
    }

    login(formData);
  };

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
      <div className="bg-orange-bg w-[90vw] tablet:w-[95vw] max-w-2xl rounded-xl shadow-lg pt-24 pb-4 px-8 -mt-28 absolute left-1/2 transform -translate-x-1/2">
        {/* BEST APPROACH: Inline loading within form container */}
        <div className="relative">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-16">
            <input
              type="text"
              name="identifier"
              value={formData.identifier}
              autoComplete="username"
              placeholder="Email or Username"
              className="bg-white-bg w-full rounded-lg p-2 italic text-sm tablet:text-base pl-4"
              onChange={handleChange}
              autoFocus
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

            <Notification />

            <button
              type="submit"
              className="bg-slate-800 hover:opacity-90 hover:text-orange-bg w-full rounded-lg text-white-txt font-bold uppercase cursor-pointer text-sm tablet:text-base p-1 mt-3"
            >
              {isPending ? <Loading color="white" size={24} /> : "Login"}
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
      </div>
      <div className="bg-light-blue min-h-[70vh]"></div>
    </section>
  );
}
