import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getProfile } from "../../redux/slice/profile/profileSlice";
import {
  FiMail,
  FiPhone,
  FiMapPin,
  FiUser,
  FiEdit2,
  FiCheckCircle,
  FiClock,
} from "react-icons/fi";
import {
  FaRegBuilding,
  FaShoppingBag,
  FaHeart,
  FaDollarSign,
} from "react-icons/fa";

const Profile = () => {
  const dispatch = useDispatch();
  const { user, loading } = useSelector((state) => state.profile);

  useEffect(() => {
    dispatch(getProfile());
  }, [dispatch]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-16 h-16 mx-auto">
            <div className="absolute inset-0 rounded-full border-4 border-orange-200"></div>
            <div className="absolute inset-0 rounded-full border-4 border-orange-500 border-t-transparent animate-spin"></div>
          </div>
          <p className="mt-3 text-gray-600 text-sm font-medium">
            Loading profile...
          </p>
        </div>
      </div>
    );
  }

  const statCards = [
    {
      label: "Total Orders",
      value: user?.stats?.totalOrders || 0,
      icon: FaShoppingBag,
      color: "bg-blue-50",
      textColor: "text-blue-600",
    },
    {
      label: "Total Spent",
      value: `$${user?.stats?.totalSpent?.toLocaleString() || "0"}`,
      icon: FaDollarSign,
      color: "bg-green-50",
      textColor: "text-green-600",
    },
    {
      label: "Wishlist",
      value: user?.stats?.wishlistCount || 0,
      icon: FaHeart,
      color: "bg-red-50",
      textColor: "text-red-600",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Profile Settings</h1>
          <p className="text-sm text-gray-500 mt-1">
            View and manage your profile information
          </p>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column - Profile Card */}
          <div className="lg:col-span-4">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              {/* Cover Image */}
              <div className="h-32 bg-gradient-to-r from-orange-500 to-red-500 relative">
                <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2">
                  <div className="relative">
                    <div className="w-28 h-28 bg-white rounded-full p-1 shadow-xl">
                      <div className="w-full h-full bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center">
                        <span className="text-4xl font-bold text-white">
                          {user?.name?.charAt(0)?.toUpperCase()}
                        </span>
                      </div>
                    </div>
                    <button className="absolute bottom-1 right-1 bg-white rounded-full p-1.5 shadow-md hover:shadow-lg transition-all">
                      <FiEdit2 className="w-3.5 h-3.5 text-gray-600" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Profile Details */}
              <div className="pt-16 pb-6 px-6 text-center">
                <h2 className="text-xl font-bold text-gray-900">
                  {user?.name}
                </h2>
                <p className="text-gray-500 text-sm mt-1 flex items-center justify-center gap-1">
                  <FiMail className="w-4 h-4" />
                  {user?.email}
                </p>

                <div className="flex gap-2 justify-center mt-3">
                  {user?.isVerified ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs font-semibold">
                      <FiCheckCircle className="w-3.5 h-3.5" />
                      Verified Account
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-yellow-50 text-yellow-700 rounded-full text-xs font-semibold">
                      <FiClock className="w-3.5 h-3.5" />
                      Pending Verification
                    </span>
                  )}
                </div>

                {user?.isAdmin && (
                  <div className="mt-2">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-xs font-semibold">
                      Administrator
                    </span>
                  </div>
                )}
              </div>

              {/* Account Info */}
              <div className="border-t border-gray-100 px-6 py-4 bg-gray-50/30">
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500">Member Since</span>
                    <span className="text-gray-900 font-medium">
                      {user?.createdAt
                        ? new Date(user.createdAt).toLocaleDateString("en-GB")
                        : "N/A"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Main Content */}
          <div className="lg:col-span-8 space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {statCards.map((stat, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-gray-500 text-xs font-medium uppercase tracking-wide">
                        {stat.label}
                      </p>
                      <p className="text-2xl font-bold text-gray-900 mt-2">
                        {stat.value}
                      </p>
                    </div>
                    <div
                      className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center`}
                    >
                      <stat.icon className={`w-6 h-6 ${stat.textColor}`} />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Personal Information Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">
                  Personal Information
                </h3>
                <p className="text-sm text-gray-500 mt-0.5">
                  Your basic information and contact details
                </p>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Full Name */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <FiUser className="w-4 h-4 text-gray-400" />
                      Full Name
                    </label>
                    <div className="bg-gray-50 rounded-lg px-4 py-2.5 border border-gray-200">
                      <p className="text-gray-900 text-sm">
                        {user?.name || "Not specified"}
                      </p>
                    </div>
                  </div>

                  {/* Email Address */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <FiMail className="w-4 h-4 text-gray-400" />
                      Email Address
                    </label>
                    <div className="bg-gray-50 rounded-lg px-4 py-2.5 border border-gray-200">
                      <p className="text-gray-900 text-sm">
                        {user?.email || "Not specified"}
                      </p>
                    </div>
                  </div>

                  {/* Phone Number */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <FiPhone className="w-4 h-4 text-gray-400" />
                      Phone Number
                    </label>
                    <div className="bg-gray-50 rounded-lg px-4 py-2.5 border border-gray-200">
                      <p className="text-gray-900 text-sm">
                        {user?.phone || "Not specified"}
                      </p>
                    </div>
                  </div>

                  {/* Gender */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <FaRegBuilding className="w-4 h-4 text-gray-400" />
                      Gender
                    </label>
                    <div className="bg-gray-50 rounded-lg px-4 py-2.5 border border-gray-200">
                      <p className="text-gray-900 text-sm capitalize">
                        {user?.gender || "Not specified"}
                      </p>
                    </div>
                  </div>

                  {/* Address - Full Width */}
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <FiMapPin className="w-4 h-4 text-gray-400" />
                      Address
                    </label>
                    <div className="bg-gray-50 rounded-lg px-4 py-2.5 border border-gray-200">
                      <p className="text-gray-900 text-sm">
                        {user?.address || "No address added"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-200">
                  <button className="px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium rounded-lg transition-colors shadow-sm">
                    Edit Profile
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
