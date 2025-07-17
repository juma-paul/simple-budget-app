import { GoogleAuthProvider, signInWithPopup, getAuth } from "firebase/auth";
import { useDispatch, useSelector } from "react-redux";
import { app } from "../firebase.js";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { googleAuthUser } from "../redux/features/user/userSlice.js";
import { clearUIState } from "../redux/features/ui/uiSlice";
import { createPortal } from "react-dom";

export default function GoogleOAuth() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error, success, message } = useSelector((state) => state.ui);
  const [showConsentModal, setShowConsentModal] = useState(false);
  const [consentData, setConsentData] = useState({
    acceptedTerms: false,
    acceptedPrivacy: false,
  });
  const [tempUserData, setTempUserData] = useState(null);

  const isConsentValid =
    consentData.acceptedTerms && consentData.acceptedPrivacy;

  const handleGoogleClick = async () => {
    try {
      // Firebase authentication
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);
      const result = await signInWithPopup(auth, provider);

      // Extract user data
      const { displayName, email, photoURL } = result.user;

      // Send to redux
      const payload = {
        name: displayName,
        email,
        photo: photoURL,
      };

      const resultAction = await dispatch(
        googleAuthUser({ payload, isConsentFollowUp: false })
      );

      if (resultAction.payload?.type === "consent_required") {
        setTempUserData(resultAction.payload.tempUserData);
        setShowConsentModal(true);
      } else if (resultAction.payload?.type === "success") {
        // Navigate to dashboard (handled in useEffect)
      }
    } catch (error) {
      console.error("Google OAuth error:", error);
    }
  };

  // Toggles checkbox state
  const handleConsentChange = (field) => {
    setConsentData((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  // Cancel Consent
  const handleConsentCancel = () => {
    setShowConsentModal(false);
    setTempUserData(null);
    setConsentData({ acceptedTerms: false, acceptedPrivacy: false });
  };

  // Consent Submission
  const handleConsentSubmit = async () => {
    if (!tempUserData || !isConsentValid) return;

    const payload = {
      ...tempUserData,
      consentAccepted: true,
    };

    const resultAction = await dispatch(
      googleAuthUser({ payload, isConsentFollowUp: true })
    );

    if (resultAction.payload?.type === "success") {
      setShowConsentModal(false);
      setTempUserData(null);
      setConsentData({ acceptedTerms: false, acceptedPrivacy: false });
    }
  };

  // Navigation after successful authentication
  useEffect(() => {
    if (success) {
      const timeout = setTimeout(() => {
        dispatch(clearUIState());
        navigate("/dashboard");
      }, 1000);

      return () => clearTimeout(timeout);
    }
  }, [success, dispatch, navigate]);

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
    <>
      <button
        type="button"
        onClick={handleGoogleClick}
        disabled={loading}
        className={`bg-green-900 text-white font-bold text-xs tablet:text-sm w-full rounded-lg hover:text-orange-bg p-[0.25rem] uppercase hover:opacity-90 mb-2 transition-opacity ${
          loading
            ? "opacity-50 cursor-not-allowed"
            : "opacity-100 cursor-pointer"
        }`}
      >
        {loading ? "Loading..." : "Continue with Google"}
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
                    checked={consentData.acceptedTerms}
                    onChange={() => handleConsentChange("acceptedTerms")}
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
                    checked={consentData.acceptedPrivacy}
                    onChange={() => handleConsentChange("acceptedPrivacy")}
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
                    disabled={!isConsentValid || loading}
                    className={`w-full sm:w-auto px-4 py-2 rounded-lg text-white transition-colors ${
                      !isConsentValid || loading
                        ? "bg-green-700 opacity-50 cursor-not-allowed"
                        : "bg-green-700 hover:bg-success"
                    }`}
                  >
                    {loading ? "Loading..." : "Submit & Continue"}
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
