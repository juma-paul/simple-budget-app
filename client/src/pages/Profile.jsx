import { Link } from "react-router-dom";
import avatar from "../assets/default-avatar.png";
import { useSelector, useDispatch } from "react-redux";
import imageCompression from "browser-image-compression";
import {
  clearUIState,
  setError,
  setMessage,
} from "../redux/features/ui/uiSlice.js";
import { useEffect, useState } from "react";
import { updateUser } from "../redux/features/user/userSlice.js";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";

export default function Profile() {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.user.currentUser);
  const { loading, error, success, message } = useSelector((state) => state.ui);

  const [image, setImage] = useState(null);
  const [formData, setFormData] = useState({});
  const [imagePercent, setImagePercent] = useState(0);

  // Handle file Selection
  const handleFileSelect = async (file) => {
    if (!file.type.startsWith("image/")) {
      dispatch(setError(true));
      dispatch(setMessage("Please select a valid image file"));
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      dispatch(setError(true));
      dispatch(setMessage("Image size must be less than 5MBs"));
      return;
    }

    try {
      const compressed = await imageCompression(file, {
        maxSizeMB: 1,
        maxWidthOrHeight: 800,
        useWebWorker: true,
      });
      setImage(compressed);
      console.log("Success: image compressed successfully!");
    } catch (error) {
      console.error("Compression failed", error);
      dispatch(setMessage("EFailed to compress image!"));
    }
  };

  // Handle file upload
  const handleFileUpload = async (imageFile) => {
    const storage = getStorage();

    const storageRef = ref(storage, `avatars/${currentUser.data._id}.jpg`);
    const uploadTask = uploadBytesResumable(storageRef, imageFile);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setImagePercent(Math.round(progress));
      },

      (error) => {
        console.error("Upload failed", error);
        dispatch(setError(true));
        dispatch(setMessage("Failed to upload image"));
      },

      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((url) => {
          const cacheBustedUrl = `${url}?t=${Date.now()}`;
          setFormData((prev) => ({
            ...prev,
            profilePicture: cacheBustedUrl,
          }));
        });
      }
    );
  };

  // Upload image to firebase when state changes
  useEffect(() => {
    if (image) {
      handleFileUpload(image);
    }
  }, [image]);

  // Handle change in form data
  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (image && !formData.profilePicture) {
      dispatch(setError(true));
      dispatch(setMessage("Please wait until image upload completes."));
      return;
    }

    // Filter out empty fields and only send fields that have actual values
    const filteredFormData = {};

    // Only include non-empty fields
    Object.keys(formData).forEach((key) => {
      const value = formData[key];

      // Skip empty strings, null, undefined
      if (value !== "" && value !== null && value !== undefined) {
        // For password fields, only include if all password fields are provided
        if (
          key === "currentPassword" ||
          key === "newPassword" ||
          key === "confirmPassword"
        ) {
          // Only include password fields if user is actually trying to change password
          if (
            formData.currentPassword &&
            formData.newPassword &&
            formData.confirmPassword
          ) {
            filteredFormData[key] = value;
          }
        } else {
          filteredFormData[key] = value;
        }
      }
    });

    console.log("Sending filtered data:", filteredFormData);
    dispatch(updateUser(filteredFormData));
  };

  useEffect(() => {
    if (error || success) {
      const timeout = setTimeout(() => {
        dispatch(clearUIState());
      }, 2000);
      return () => clearTimeout(timeout);
    }
  }, [error, success]);

  useEffect(() => {
    if (currentUser.data) {
      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
        firstName: currentUser.data.firstName || "",
        lastName: currentUser.data.lastName || "",
        username: currentUser.data.username || "",
        profilePicture: currentUser.data.profilePicture || "",
      });
    }
  }, [currentUser]);

  console.log(formData);

  return (
    <>
      <hr className="mt-5 h-[0.125rem] bg-white-ln mx-4 tablet:mx-12 desktop:mx-20 border-0" />

      {/* Navigation button to Dashboard */}
      <div className="flex justify-end mx-4 tablet:mx-12 desktop:mx-20 mt-6 tablet:mt-8 desktop:mt-10">
        <Link
          to="/dashboard"
          className="bg-dark-blue text-white-txt rounded-full py-1 px-3 tablet:py-2 tablet:px-4 text-sm tablet:text-base desktop:text-lg"
        >
          Go back to Dashboard
        </Link>
      </div>

      {/* Profile pic and input fields */}
      <div className="mx-4 tablet:mx-12 desktop:mx-20 mt-6 tablet:mt-8 desktop:mt-10">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 tablet:grid-cols-[auto_1fr] gap-6 tablet:gap-8 desktop:gap-12">
            <div className="w-32 tablet:w-44 desktop:w-52 mx-auto tablet:mx-0">
              {/* Hidden file input */}
              <input
                id="profile-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleFileSelect(e.target.files[0])}
              />
              <div className="relative w-32 h-32 tablet:w-40 tablet:h-40 desktop:w-52 desktop:h-52">
                {/* Image with upload overlay */}
                <div className="rounded-full overflow-hidden border-2 border-gray-400 w-full h-full">
                  <img
                    src={
                      formData.profilePicture
                        ? typeof formData.profilePicture === "string"
                          ? formData.profilePicture
                          : URL.createObjectURL(formData.profilePicture)
                        : currentUser.data.profilePicture || avatar
                    }
                    alt="Profile"
                    className="w-full h-full object-cover"
                    onClick={() =>
                      document.getElementById("profile-upload").click()
                    }
                    onError={(e) => (e.target.src = avatar)}
                  />

                  {/* Upload button overlay */}
                  <div className="absolute bottom-0 right-0">
                    <label
                      htmlFor="profile-upload"
                      className="text-white rounded-full p-2 cursor-pointer shadow-lg transition-colors"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 448 512"
                        className="w-7 h-7 p-1 fill-white-txt bg-orange-txt rounded-full"
                      >
                        <path d="M246.6 9.4c-12.5-12.5-32.8-12.5-45.3 0l-128 128c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 109.3 192 320c0 17.7 14.3 32 32 32s32-14.3 32-32l0-210.7 73.4 73.4c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-128-128zM64 352c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 64c0 53 43 96 96 96l256 0c53 0 96-43 96-96l0-64c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 64c0 17.7-14.3 32-32 32L96 448c-17.7 0-32-14.3-32-32l0-64z" />
                      </svg>
                    </label>
                  </div>
                </div>

                {/* Upload progress */}
                {imagePercent > 0 && imagePercent < 100 && (
                  <span className="text-slate-700 text-sm text-center block mt-2">
                    Uploading: {imagePercent}%
                  </span>
                )}

                {/* Member since text */}
                <p className="text-center text-gray-600 text-sm md:text-base mt-2">
                  Member since{" "}
                  <span className="font-extrabold text-orange-txt">
                    {currentUser?.data?.createdAt
                      ? new Date(currentUser.data.createdAt).toLocaleDateString(
                          "en-US",
                          {
                            month: "2-digit",
                            day: "2-digit",
                            year: "2-digit",
                          }
                        )
                      : "MM/DD/YY"}
                  </span>
                </p>
              </div>
            </div>

            <div className="bg-light-blue rounded-4xl flex-1 text-white-txt">
              <p className="text-xl tablet:text-2xl desktop:text-3xl m-5">
                My Profile
              </p>
              <hr className="h-[0.125rem] bg-gray-500 mx-4 -mt-3 tablet:mx-6 border-0" />

              <label
                htmlFor="firstName"
                className="flex items-center gap-4 m-4 flex-nowrap"
              >
                <p className="text-sm tablet:text-lg desktop:text-xl whitespace-nowrap">
                  First Name
                </p>
                <input
                  value={formData.firstName || ""}
                  type="text"
                  id="firstName"
                  placeholder="First Name"
                  className="p-2 bg-white-ln rounded-lg text-black italic w-full text-sm tablet:text-base desktop:text-lg"
                  onChange={handleChange}
                />
              </label>

              <label
                htmlFor="lastName"
                className="flex items-center gap-4 m-4 flex-nowrap"
              >
                <p className="text-sm tablet:text-lg desktop:text-xl whitespace-nowrap">
                  Last Name
                </p>
                <input
                  value={formData.lastName || ""}
                  type="text"
                  id="lastName"
                  placeholder="Last Name"
                  className="p-2 bg-white-ln rounded-lg text-black italic w-full text-sm tablet:text-base desktop:text-lg"
                  onChange={handleChange}
                />
              </label>

              <label
                htmlFor="username"
                className="flex items-center gap-4 m-4 flex-nowrap"
              >
                <p className="text-sm tablet:text-lg desktop:text-xl whitespace-nowrap">
                  Username
                </p>
                <input
                  value={formData.username || ""}
                  type="text"
                  id="username"
                  placeholder="Username"
                  className="p-2 bg-white-ln rounded-lg text-black italic w-full text-sm tablet:text-base desktop:text-lg"
                  onChange={handleChange}
                />
              </label>

              <label
                htmlFor="email"
                className="flex items-center gap-4 m-4 flex-nowrap"
              >
                <p className="text-sm tablet:text-lg desktop:text-xl whitespace-nowrap">
                  Email Address
                </p>
                <input
                  value={formData.email || currentUser.data?.email || ""}
                  type="email"
                  id="email"
                  placeholder="Email Address"
                  disabled
                  className="p-2 ml-11 bg-white-ln rounded-lg text-black italic w-full text-sm tablet:text-base desktop:text-lg disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed"
                  onChange={handleChange}
                />
              </label>

              <label
                htmlFor="confirmPassword"
                className="flex items-center gap-4 m-4 flex-nowrap"
              >
                <p className="text-sm tablet:text-lg desktop:text-xl whitespace-nowrap">
                  Current Password
                </p>
                <input
                  value={formData.currentPassword || ""}
                  type="password"
                  id="currentPassword"
                  placeholder="Current Password"
                  className="p-2 bg-white-ln rounded-lg text-black italic w-full text-sm tablet:text-base desktop:text-lg"
                  onChange={handleChange}
                />
              </label>

              <label
                htmlFor="newPassword"
                className="flex items-center gap-4 m-4 flex-nowrap"
              >
                <p className="text-sm tablet:text-lg desktop:text-xl whitespace-nowrap">
                  New Password
                </p>
                <input
                  value={formData.newPassword || ""}
                  type="password"
                  id="newPassword"
                  placeholder="New Password"
                  className="p-2 ml-9 bg-white-ln rounded-lg text-black italic w-full text-sm tablet:text-base desktop:text-lg"
                  onChange={handleChange}
                />
              </label>

              <label
                htmlFor="confirmPassword"
                className="flex items-center gap-4 m-4 flex-nowrap"
              >
                <p className="text-sm tablet:text-lg desktop:text-xl whitespace-nowrap">
                  Confirm Password
                </p>
                <input
                  value={formData.confirmPassword || ""}
                  type="password"
                  id="confirmPassword"
                  placeholder="Confirm Password"
                  className="p-2 bg-white-ln rounded-lg text-black italic w-full text-sm tablet:text-base desktop:text-lg"
                  onChange={handleChange}
                />
              </label>
            </div>

            <div className="tablet:col-start-2 tablet:col-end-3">
              {/* Status Messages */}
              {error && (
                <p className="text-red-700 text-center">
                  {message || "Something went wrong!"}
                </p>
              )}
              {success && (
                <p className="text-green-700 text-center">
                  {message || "Profile updated successfully!"}
                </p>
              )}
              <div
                className="
                      flex flex-col tablet:flex-row items-center justify-center 
                      gap-4 tablet:gap-10 desktop:gap-20 
                      mb-10 px-4 tablet:px-8 desktop:px-20
                    "
              >
                <button
                  type="submit"
                  disabled={loading || (image && !formData.profilePicture)}
                  className="
                      border-2 cursor-pointer text-light-blue px-5 py-2 rounded-full
                      hover:bg-gray-500 hover:text-white-txt transition-colors
                      w-full tablet:w-auto text-center
                    "
                >
                  {loading ? "Loading..." : "Update"}
                </button>

                <span
                  onClick={null}
                  className="
                    text-green-700 cursor-pointer px-5 py-2 border-2 rounded-full 
                    hover:bg-gray-500 hover:text-white-txt
                    w-full tablet:w-auto text-center
                  "
                >
                  Restore Account
                </span>

                <span
                  onClick={null}
                  className="
                    text-error cursor-pointer px-5 py-2 border-2 rounded-full 
                    hover:bg-gray-500 hover:text-white-txt
                    w-full tablet:w-auto text-center
                  "
                >
                  Delete Account
                </span>
              </div>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}
