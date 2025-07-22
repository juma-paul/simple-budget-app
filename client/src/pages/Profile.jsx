import { Link } from "react-router-dom";
import avatar from "../assets/default-avatar.png";
import { useSelector } from "react-redux";

export default function Profile() {
  const currentUser = useSelector((state) => state.user.currentUser);

  return (
    <>
      <hr className="mt-1 h-[0.125rem] bg-white-ln mx-4 tablet:mx-12 desktop:mx-20 border-0" />

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
        <form>
          <div className="flex flex-col tablet:flex-row gap-6 tablet:gap-8 desktop:gap-12">
            <div className="w-32 tablet:w-44 desktop:w-52 mx-auto tablet:mx-0">
              {/* Image with upload overlay */}
              <div className="relative">
                <img
                  src={
                    currentUser?.data?.photoUrl
                      ? currentUser.data.photoUrl
                      : avatar
                  }
                  alt="Profile"
                  className="w-full h-32 tablet:h-44 desktop:h-52 rounded-full object-cover border-2 border-gray-400"
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
                  <input
                    id="profile-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    // onChange={handleImageUpload}
                  />
                </div>
              </div>

              {/* Member since text */}
              <p className="text-center text-gray-600 text-sm md:text-base mt-2">
                Member since{" "}
                <span className="font-extrabold text-black">
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

            <div className="bg-light-blue rounded-4xl flex-1 text-white-txt">
              <p className="text-xl tablet:text-2xl desktop:text-3xl m-5">
                My Profile
              </p>
              <hr className="h-[0.125rem] bg-gray-500 mx-4 -mt-3 tablet:mx-6 border-0" />

              <label
                htmlFor="firstName"
                className="flex items-center gap-4 m-4 flex-nowrap"
              >
                <p className="text-lg tablet:text-xl desktop:text-2xl whitespace-nowrap">
                  First Name
                </p>
                <input
                  type="text"
                  id="firstName"
                  placeholder="First Name"
                  className="p-2 bg-white-ln rounded-lg text-black italic w-full text-sm tablet:text-base desktop:text-lg"
                />
              </label>

              <label
                htmlFor="lastName"
                className="flex items-center gap-4 m-4 flex-nowrap"
              >
                <p className="text-lg tablet:text-xl desktop:text-2xl whitespace-nowrap">
                  Last Name
                </p>
                <input
                  type="text"
                  id="lastName"
                  placeholder="Last Name"
                  className="p-2 bg-white-ln rounded-lg text-black italic w-full text-sm tablet:text-base desktop:text-lg"
                />
              </label>

              <label
                htmlFor="username"
                className="flex items-center gap-4 m-4 flex-nowrap"
              >
                <p className="text-lg tablet:text-xl desktop:text-2xl whitespace-nowrap">
                  Username
                </p>
                <input
                  type="text"
                  id="username"
                  placeholder="Username"
                  className="p-2 bg-white-ln rounded-lg text-black italic w-full text-sm tablet:text-base desktop:text-lg"
                />
              </label>

              <label
                htmlFor="email"
                className="flex items-center gap-4 m-4 flex-nowrap"
              >
                <p className="text-lg tablet:text-xl desktop:text-2xl whitespace-nowrap">
                  Email Address
                </p>
                <input
                  type="email"
                  id="email"
                  placeholder="Email Address"
                  className="p-2 ml-11 bg-white-ln rounded-lg text-black italic w-full text-sm tablet:text-base desktop:text-lg"
                />
              </label>

              <label
                htmlFor="confirmPassword"
                className="flex items-center gap-4 m-4 flex-nowrap"
              >
                <p className="text-lg tablet:text-xl desktop:text-2xl whitespace-nowrap">
                  Current Password
                </p>
                <input
                  type="password"
                  id="currentPassword"
                  placeholder="Current Password"
                  className="p-2 bg-white-ln rounded-lg text-black italic w-full text-sm tablet:text-base desktop:text-lg"
                />
              </label>

              <label
                htmlFor="newPassword"
                className="flex items-center gap-4 m-4 flex-nowrap"
              >
                <p className="text-lg tablet:text-xl desktop:text-2xl whitespace-nowrap">
                  New Password
                </p>
                <input
                  type="password"
                  id="newPassword"
                  placeholder="New Password"
                  className="p-2 ml-9 bg-white-ln rounded-lg text-black italic w-full text-sm tablet:text-base desktop:text-lg"
                />
              </label>

              <label
                htmlFor="confirmPassword"
                className="flex items-center gap-4 m-4 flex-nowrap"
              >
                <p className="text-lg tablet:text-xl desktop:text-2xl whitespace-nowrap">
                  Confirm Password
                </p>
                <input
                  type="password"
                  id="confirmPassword"
                  placeholder="Confirm Password"
                  className="p-2 bg-white-ln rounded-lg text-black italic w-full text-sm tablet:text-base desktop:text-lg"
                />
              </label>
            </div>
          </div>
          <div
            className="
                      flex flex-col tablet:flex-row items-center justify-center 
                      gap-4 tablet:gap-10 desktop:gap-20 
                      mt-7 mb-7 px-4 tablet:px-8 desktop:px-20
                    "
          >
            <button
              type="submit"
              className="
                      border-2 cursor-pointer text-light-blue px-5 py-2 rounded-full
                      hover:bg-gray-500 hover:text-white-txt transition-colors
                      w-full tablet:w-auto text-center
                    "
            >
              Update
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
        </form>
      </div>
    </>
  );
}
