import { GoogleAuthProvider, signInWithPopup, getAuth } from "firebase/auth";
import { app } from "../firebase.js";
import { useNavigate } from "react-router-dom";
import { useNotificationStore } from "../store/notificationStore.js";
import { useAuthStore } from "../store/authStore.js";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { createPortal } from "react-dom";
import { googleOAuthApi } from "../api/authApi.js";
import Loading from "./Loading.jsx";
import Notification from "./Notification.jsx";

export default function GoogleOAuth() {
  const navigate = useNavigate();
  const { setNotification, clearNotification } = useNotificationStore();
  const { setUser } = useAuthStore();

  const [showConsentModal, setShowConsentModal] = useState(false);
  const [consentData, setConsentData] = useState({
    acceptedTerms: false,
    acceptedPrivacy: false,
  });
  const [tempUserData, setTempUserData] = useState(null);

  const isConsentValid =
    consentData.acceptedTerms && consentData.acceptedPrivacy;

  const { mutate: googleAuth, isPending } = useMutation({
    mutationFn: googleOAuthApi,
    onSuccess: (data) => {
      // Check if consent is required (new user)
      if (data?.status === "consent_required") {
        setTempUserData(data.tempUserData);
        setShowConsentModal(true);
        return;
      }

      if (data?.data) {
        setNotification("success", data.message || "Login successful!");

        setTimeout(() => {
          setUser(data.data);
          clearNotification();
          if (data.data.isDeleted) {
            navigate("/dashboard/profile", { replace: true });
          } else {
            navigate("/dashboard", { replace: true });
          }
        }, 1500);
      }
    },
    onError: (error) => {
      setNotification("error", error.message);
      handleConsentCancel();
    },
  });

  const handleGoogleClick = async () => {
    try {
      // Firebase authentication
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: "select_account" });
      const auth = getAuth(app);
      const result = await signInWithPopup(auth, provider);

      // Extract user data
      const { displayName, email, photoURL } = result.user;

      // Send to backend (first attempt checks if consent is true/false)
      const userData = {
        name: displayName,
        email,
        photo: photoURL,
        consentAccepted: false,
      };

      googleAuth(userData);
    } catch (error) {
      console.error("Google OAuth error:", error);
      setNotification("error", "Google authentication failed");
    }
  };

  // Save actions on consent fields
  const handleConsentChange = (e) => {
    const { name, checked } = e.target;
    setConsentData((prev) => ({ ...prev, [name]: checked }));
  };

  // Cancel consent form
  const handleConsentCancel = () => {
    setShowConsentModal(false);
    setTempUserData(null);
    setConsentData({ acceptedTerms: false, acceptedPrivacy: false });
  };

  // Submit the consent form
  const handleConsentSubmit = () => {
    if (!tempUserData || !isConsentValid) return;

    // Submit with consent accepted
    const payload = {
      ...tempUserData,
      consentAccepted: true,
    };

    googleAuth(payload);

    setShowConsentModal(false);
    setConsentData({ acceptedTerms: false, acceptedPrivacy: false });
  };

  return (
    <>
      <button
        type="button"
        onClick={handleGoogleClick}
        disabled={isPending}
        className={`bg-green-900 text-white font-bold text-sm tablet:text-base w-full rounded-lg hover:text-orange-bg p-1 uppercase hover:opacity-90 mb-2 transition-opacity ${
          isPending
            ? "opacity-50 cursor-not-allowed"
            : "opacity-100 cursor-pointer"
        }`}
      >
        {isPending ? (
          <Loading color="white" size={24} />
        ) : (
          "Continue with Google"
        )}
      </button>

      {/* Consent Modal */}
      {showConsentModal &&
        createPortal(
          <div className="fixed inset-0 bg-gradient-to-b from-white-txt/20 to-white-txt/50 backdrop-blur-[0.2rem] flex items-center justify-center p-4 z-50 transition-all duration-300">
            <div className="bg-dark-blue rounded-xl shadow-2xl max-w-md w-full p-6">
              {/* Title */}
              <div className="text-center mb-4">
                <h2 className="text-xl font-bold text-orange-txt mb-2">
                  Complete Your Registration
                </h2>
                <p className="text-white-txt text-sm">
                  Please accept the terms and privacy policy to continue.
                </p>
              </div>

              {/* Checkboxes */}
              <div className="space-y-4 mb-6">
                {/* Terms */}
                <label
                  htmlFor="acceptedTerms"
                  className="flex items-start gap-3 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    name="acceptedTerms"
                    checked={consentData.acceptedTerms}
                    onChange={handleConsentChange}
                    className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />

                  <span className="text-xs text-white-txt">
                    I accept the{" "}
                    <Link
                      to="/terms"
                      className="text-gray-500 hover:text-orange-txt underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      general terms of service and conditions of use
                    </Link>
                  </span>
                </label>

                {/* Privacy */}
                <label
                  htmlFor="acceptedPrivacy"
                  className="flex items-start gap-3 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    name="acceptedPrivacy"
                    checked={consentData.acceptedPrivacy}
                    onChange={handleConsentChange}
                    className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />

                  <span className="text-xs text-white-txt">
                    I accept the{" "}
                    <Link
                      to="/privacy"
                      className="text-gray-500 hover:text-orange-txt underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      privacy policy
                    </Link>
                  </span>
                </label>

                <Notification />

                <div className="flex flex-col tablet:flex-row gap-3">
                  {/* Cancel */}
                  <button
                    onClick={handleConsentCancel}
                    className="w-full sm:w-auto px-4 py-2 bg-slate-600 text-white hover:bg-slate-500 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>

                  {/* Submit & Continue */}
                  <button
                    onClick={handleConsentSubmit}
                    disabled={!isConsentValid || isPending}
                    className={`w-full sm:w-auto px-4 py-2 rounded-lg text-white transition-colors ${
                      !isConsentValid || isPending
                        ? "bg-green-700 opacity-50 cursor-not-allowed"
                        : "bg-green-700 hover:bg-success"
                    }`}
                  >
                    {isPending ? (
                      <Loading color="white" size={24} />
                    ) : (
                      "Submit & Continue"
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
