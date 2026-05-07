import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getProfile, updateProfile } from "../../redux/slice/profile/profileSlice";
import {
  FiMail, FiPhone, FiUser, FiCheckCircle, FiClock,
} from "react-icons/fi";
import { FaRegBuilding, FaShoppingBag, FaRupeeSign } from "react-icons/fa";

const DotLoader = ({ white = false }) => (
  <span className="dot-loader inline-flex items-center gap-1 ml-1">
    <span style={{ backgroundColor: white ? "#fff" : "#f97316" }}></span>
    <span style={{ backgroundColor: white ? "#fff" : "#f97316" }}></span>
    <span style={{ backgroundColor: white ? "#fff" : "#f97316" }}></span>
  </span>
);

const Profile = () => {
  const dispatch = useDispatch();
  const { user, loading, updating } = useSelector((state) => state.profile);

  const [isEditing, setIsEditing] = useState(false);
  const [visible, setVisible] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", gender: "" });

  useEffect(() => {
    dispatch(getProfile());
  }, [dispatch]);

  // Smooth fade-in jab data aa jaye
  useEffect(() => {
    if (!loading && user) {
      const timer = setTimeout(() => setVisible(true), 50);
      return () => clearTimeout(timer);
    } else {
      setVisible(false);
    }
  }, [loading, user]);

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || "",
        phone: user.phone || "",
        gender: user.gender || "",
      });
    }
  }, [user]);

  const handleEditToggle = () => {
    if (isEditing) {
      setForm({
        name: user.name || "",
        phone: user.phone || "",
        gender: user.gender || "",
      });
    }
    setIsEditing((prev) => !prev);
  };

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSave = async () => {
    await dispatch(updateProfile(form));
    setIsEditing(false);
  };

  // Full page loader
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-4">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-4 border-orange-100"></div>
          <div className="absolute inset-0 rounded-full border-4 border-orange-500 border-t-transparent animate-spin"></div>
        </div>
        <p className="text-gray-500 text-sm font-medium tracking-wide">
          Loading your profile<DotLoader />
        </p>
      </div>
    );
  }

  const renderField = (label, icon, fieldKey, type = "text", options = null) => {
    const Icon = icon;
    return (
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
          <Icon className="w-4 h-4 text-gray-400" />
          {label}
        </label>
        {isEditing ? (
          options ? (
            <select
              name={fieldKey}
              value={form[fieldKey]}
              onChange={handleChange}
              disabled={updating}
              className="w-full bg-white rounded-lg px-4 py-2.5 border border-orange-300 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 transition capitalize disabled:opacity-60"
            >
              <option value="">Select</option>
              {options.map((opt) => (
                <option key={opt} value={opt} className="capitalize">{opt}</option>
              ))}
            </select>
          ) : (
            <input
              type={type}
              name={fieldKey}
              value={form[fieldKey]}
              onChange={handleChange}
              disabled={updating}
              className="w-full bg-white rounded-lg px-4 py-2.5 border border-orange-300 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 transition disabled:opacity-60"
            />
          )
        ) : (
          <div className="bg-gray-50 rounded-lg px-4 py-2.5 border border-gray-200 flex items-center min-h-[42px]">
            <p className="text-gray-900 text-sm capitalize flex-1">
              {user?.[fieldKey] || "Not specified"}
            </p>
            {updating && <DotLoader />}
          </div>
        )}
      </div>
    );
  };

  return (
    <div
      className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8 transition-all duration-500"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(12px)",
        transition: "opacity 0.5s ease, transform 0.5s ease",
      }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Profile Settings</h1>
          <p className="text-sm text-gray-500 mt-1">
            View and manage your profile information
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-4">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="h-32 bg-gradient-to-r from-orange-500 to-red-500 relative">
                <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2">
                  <div className="w-28 h-28 bg-white rounded-full p-1 shadow-xl">
                    <div className="w-full h-full bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center">
                      <span className="text-4xl font-bold text-white">
                        {user?.name?.charAt(0)?.toUpperCase()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-16 pb-6 px-6 text-center">
                <h2 className="text-xl font-bold text-gray-900">{user?.name}</h2>
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

              <div className="border-t border-gray-100 px-6 py-4 bg-gray-50/30">
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

          {/* Right Column */}
          <div className="lg:col-span-8 space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-gray-500 text-xs font-medium uppercase tracking-wide">
                      Total Orders
                    </p>
                    <p className="text-2xl font-bold text-gray-900 mt-2">
                      {user?.totalOrders || 0}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                    <FaShoppingBag className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-gray-500 text-xs font-medium uppercase tracking-wide">
                      Total Spent
                    </p>
                    <p className="text-2xl font-bold text-gray-900 mt-2">
                      {user?.totalSpent?.toLocaleString() || "0"}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
                    <FaRupeeSign className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Personal Information */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">
                  Personal Information
                </h3>
                <p className="text-sm text-gray-500 mt-0.5">
                  {isEditing
                    ? "Edit your details and save changes"
                    : "Your basic information and contact details"}
                </p>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {renderField("Full Name", FiUser, "name")}

                  {/* Email — always frozen */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <FiMail className="w-4 h-4 text-gray-400" />
                      Email Address
                    </label>
                    <div className="bg-gray-50 rounded-lg px-4 py-2.5 border border-gray-200 min-h-[42px] flex items-center">
                      <p className="text-gray-900 text-sm">
                        {user?.email || "Not specified"}
                      </p>
                    </div>
                  </div>

                  {renderField("Phone Number", FiPhone, "phone", "tel")}
                  {renderField("Gender", FaRegBuilding, "gender", "text", [
                    "male", "female", "other",
                  ])}
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-200">
                  {isEditing ? (
                    <>
                      <button
                        onClick={handleEditToggle}
                        disabled={updating}
                        className="px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg transition-colors disabled:opacity-60"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSave}
                        disabled={updating}
                        className="px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium rounded-lg transition-colors shadow-sm flex items-center gap-2 disabled:opacity-70"
                      >
                        {updating ? <>Saving <DotLoader white /></> : "Save Changes"}
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={handleEditToggle}
                      className="px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium rounded-lg transition-colors shadow-sm"
                    >
                      Edit Profile
                    </button>
                  )}
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