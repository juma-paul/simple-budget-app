export const fetchWithAuth = async (url, options = {}) => {
  let response = await fetch(url, { ...options, credentials: "include" });

  // If 401 and token expired, try refresh
  if (response.status === 401) {
    let errorData = {};

    try {
      errorData = await response.clone().json();
    } catch {}

    if (errorData?.error === "token_expired") {
      const refreshResponse = await fetch("/api/auth/refresh", {
        method: "POST",
        credentials: "include",
      });

      if (refreshResponse.ok) {
        response = await fetch(url, { ...options, credentials: "include" });
      } else {
        throw new Error("Session expired. Please login again.");
      }
    }
  }

  if (!response.ok) {
    let errorData = {};
    try {
      errorData = await response.clone().json();
    } catch {}
    const error = new Error(errorData?.message || "Request failed");
    throw error;
  }

  return response.json();
};
