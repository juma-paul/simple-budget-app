const PUBLIC_PATHS = [
  "/",
  "api/auth/login",
  "api/auth/signup",
  "api/auth/google",
  "api/auth/refresh",
];

// Wrapper for fetch with token refresh logic

export const apiCallWithRefresh = async (url, options = {}) => {
  const isPublicPath = PUBLIC_PATHS.some((path) => url.startsWith(path));

  try {
    let res = await fetch(url, {
      ...options,
      credentials: "include",
    });

    if (res.status === 401 && !isPublicPath) {
      const refreshRes = await fetch("/api/auth/refresh", {
        method: "POST",
        credentials: "include",
      });

      if (refreshRes.ok) {
        res = await fetch(url, {
          ...options,
          credentials: "include",
        });
      } else {
        throw new Error("Session expired. Please login again");
      }
    }
    return res;
  } catch (error) {
    throw error;
  }
};
