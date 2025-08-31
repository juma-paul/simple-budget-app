import { fetchWithAuth } from "../utils/fetchWithAuth.js";

// Update profile
export const updateProfileApi = async (formData) => {
  return await fetchWithAuth("/api/profile/update", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData),
  });
};

// Delete account
export const deleteAccountApi = async (formData) => {
  return await fetchWithAuth("/api/profile/delete", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData),
  });
};

// Restore account
export const restoreAccountApi = async () => {
  return await fetchWithAuth("/api/profile/restore", {
    method: "POSt",
    headers: { "Content-Type": "application/json" },
  });
};
