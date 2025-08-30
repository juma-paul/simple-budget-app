import { fetchWithAuth } from "../utils/fetchWithAuth.js";

// Login a user
export const loginApi = async (formData) => {
  const { identifier, password } = formData;

  return await fetchWithAuth("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ identifier, password }),
  });
};

// Signup new user
export const signupApi = async (formData) => {
  const { username, email, password, acceptedTerms, acceptedPrivacy } =
    formData;

  return await fetchWithAuth("/api/auth/signup", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username,
      email,
      password,
      acceptedTerms,
      acceptedPrivacy,
    }),
  });
};

// Google OAuth Login
export const googleOAuthApi = async (formData) => {
  const { name, email, photo, consentAccepted } = formData;

  return await fetchWithAuth("/api/auth/google", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, photo, consentAccepted }),
  });
};
