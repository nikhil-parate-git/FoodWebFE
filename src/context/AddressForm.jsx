import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  Building2,
  Loader2,
  Search,
  ChevronDown,
  X,
} from "lucide-react";
import { createAddress } from "../redux/slice/addressform/addressFormSlice";
import { Country, State, City } from "country-state-city";
import { toast } from "react-toastify";
import { calcFees } from "../utils/cartFees";

// ─── Reusable Searchable Dropdown ───────────────────────────────────────────
const SearchableDropdown = ({
  placeholder,
  options = [],
  value,
  onChange,
  disabled = false,
  displayKey = "name",
  valueKey = "isoCode",
}) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef(null);
  const inputRef = useRef(null);

  const filtered = options.filter((opt) =>
    opt[displayKey]?.toLowerCase().includes(search.toLowerCase()),
  );

  const selected = options.find(
    (opt) => (valueKey ? opt[valueKey] : opt[displayKey]) === value,
  );

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
      setSearch("");
    }
  }, [open]);

  const handleSelect = (opt) => {
    onChange(valueKey ? opt[valueKey] : opt[displayKey], opt);
    setOpen(false);
    setSearch("");
  };

  const handleClear = (e) => {
    e.stopPropagation();
    onChange("", null);
    setSearch("");
  };

  return (
    <div ref={ref} className="relative w-full">
      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setOpen((p) => !p)}
        className={`w-full bg-white border rounded-xl px-3 py-3 text-sm flex items-center justify-between gap-2 transition-all outline-none
          ${open ? "border-[#e84825] ring-2 ring-[#e84825]/10" : "border-gray-200"}
          ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:border-gray-300"}
        `}
      >
        <span className={selected ? "text-gray-800" : "text-gray-300"}>
          {selected
            ? selected.flag
              ? `${selected.flag} ${selected[displayKey]}`
              : selected[displayKey]
            : placeholder}
        </span>
        <span className="flex items-center gap-1 shrink-0">
          {selected && !disabled && (
            <span
              onClick={handleClear}
              className="text-gray-300 hover:text-gray-500 transition-colors p-0.5 rounded"
            >
              <X className="w-3.5 h-3.5" />
            </span>
          )}
          <ChevronDown
            className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          />
        </span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="absolute z-50 mt-1.5 w-full bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden"
          >
            <div className="p-2 border-b border-gray-100">
              <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2">
                <Search className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                <input
                  ref={inputRef}
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder={`Search ${placeholder.toLowerCase()}...`}
                  className="flex-1 text-sm bg-transparent outline-none text-gray-700 placeholder:text-gray-400"
                />
                {search && (
                  <button type="button" onClick={() => setSearch("")}>
                    <X className="w-3.5 h-3.5 text-gray-400 hover:text-gray-600" />
                  </button>
                )}
              </div>
            </div>

            <div className="max-h-52 overflow-y-auto">
              {filtered.length > 0 ? (
                filtered.map((opt, i) => {
                  const isSelected =
                    (valueKey ? opt[valueKey] : opt[displayKey]) === value;
                  return (
                    <button
                      key={i}
                      type="button"
                      onClick={() => handleSelect(opt)}
                      className={`w-full text-left px-3 py-2.5 text-sm flex items-center gap-2 transition-colors
                        ${
                          isSelected
                            ? "bg-[#e84825]/8 text-[#e84825] font-medium"
                            : "text-gray-700 hover:bg-gray-50"
                        }
                      `}
                    >
                      {opt.flag && (
                        <span className="text-base leading-none">
                          {opt.flag}
                        </span>
                      )}
                      <span className="truncate">{opt[displayKey]}</span>
                      {isSelected && (
                        <span className="ml-auto text-[#e84825] text-xs">
                          ✓
                        </span>
                      )}
                    </button>
                  );
                })
              ) : (
                <div className="px-3 py-6 text-center text-sm text-gray-400">
                  No results found
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ─── Main Component ──────────────────────────────────────────────────────────
const AddressForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { totalPrice } = useSelector((state) => state.pagecart);
  const { loading } = useSelector((state) => state.address);

  // ✅ Fees from shared utility — consistent with CartPage & Payment
  const {
    deliveryFee: DELIVERY_FEE,
    platformFee: PLATFORM_FEE,
    packingCharge: PACKING,
    grandTotal: GRAND_TOTAL,
  } = calcFees(totalPrice);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
    phone: "",
  });

  const [selectedCountryCode, setSelectedCountryCode] = useState("");
  const [selectedStateCode, setSelectedStateCode] = useState("");
  const [cityManual, setCityManual] = useState(false);

  const allCountries = Country.getAllCountries();
  const allStates = selectedCountryCode
    ? State.getStatesOfCountry(selectedCountryCode)
    : [];
  const allCities =
    selectedCountryCode && selectedStateCode
      ? City.getCitiesOfState(selectedCountryCode, selectedStateCode)
      : [];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCountryChange = (isoCode, obj) => {
    setSelectedCountryCode(isoCode || "");
    setSelectedStateCode("");
    setCityManual(false);
    setFormData((prev) => ({
      ...prev,
      country: obj ? obj.name : "",
      state: "",
      city: "",
    }));
  };

  const handleStateChange = (isoCode, obj) => {
    setSelectedStateCode(isoCode || "");
    setCityManual(false);
    setFormData((prev) => ({
      ...prev,
      state: obj ? obj.name : "",
      city: "",
    }));
  };

  const handleCityChange = (cityName) => {
    setFormData((prev) => ({ ...prev, city: cityName || "" }));
  };

  const cityOptions = allCities.map((c) => ({ name: c.name }));

  useEffect(() => {
    if (selectedStateCode && allCities.length === 0) {
      setCityManual(true);
    } else {
      setCityManual(false);
    }
  }, [selectedStateCode, allCities.length]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token =
      localStorage.getItem("token") ||
      localStorage.getItem("authToken") ||
      localStorage.getItem("userToken") ||
      (() => {
        try {
          return JSON.parse(localStorage.getItem("user"))?.token;
        } catch {
          return null;
        }
      })();

    if (!token) {
      toast.error("Please login to continue");
      navigate("/login");
      return;
    }

    const resultAction = await dispatch(createAddress(formData));
    if (createAddress.fulfilled.match(resultAction)) {
      navigate("/payment");
    }
  };

  const inputStyle =
    "w-full bg-white border border-gray-200 rounded-xl p-3 text-sm outline-none focus:border-[#e84825] focus:ring-2 focus:ring-[#e84825]/10 transition-all placeholder:text-gray-300 autofill-custom";

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <style>{`
        input.autofill-custom:-webkit-autofill,
        input.autofill-custom:-webkit-autofill:hover,
        input.autofill-custom:-webkit-autofill:focus {
          -webkit-box-shadow: 0 0 0px 1000px white inset !important;
          -webkit-text-fill-color: #333 !important;
          transition: background-color 5000s ease-in-out 0s;
        }
      `}</style>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-1 h-8 bg-gradient-to-b from-[#e84825] to-[#ff6b4a] rounded-full" />
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            Delivery Information
          </h1>
        </div>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 lg:grid-cols-5 gap-10 items-start"
        >
          {/* ── Left: Address Form ── */}
          <div className="lg:col-span-3 bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8">
            <div className="flex items-center gap-2 mb-6">
              <MapPin className="w-5 h-5 text-[#e84825]" />
              <h2 className="text-lg font-bold text-gray-800">
                Shipping Address
              </h2>
            </div>

            <div className="space-y-4">
              <div className="flex gap-4">
                <input
                  required
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  type="text"
                  placeholder="First name"
                  className={inputStyle}
                />
                <input
                  required
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  type="text"
                  placeholder="Last name"
                  className={inputStyle}
                />
              </div>

              <input
                required
                name="email"
                value={formData.email}
                onChange={handleChange}
                type="email"
                placeholder="Email address"
                className={inputStyle}
              />

              <input
                required
                name="street"
                value={formData.street}
                onChange={handleChange}
                type="text"
                placeholder="Street address"
                className={inputStyle}
              />

              <SearchableDropdown
                placeholder="Select Country"
                options={allCountries}
                value={selectedCountryCode}
                onChange={handleCountryChange}
                displayKey="name"
                valueKey="isoCode"
              />

              <div className="flex gap-4">
                <SearchableDropdown
                  placeholder="Select State"
                  options={allStates}
                  value={selectedStateCode}
                  onChange={handleStateChange}
                  disabled={!selectedCountryCode}
                  displayKey="name"
                  valueKey="isoCode"
                />

                {cityManual ? (
                  <input
                    required
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    type="text"
                    placeholder="Enter city"
                    className={inputStyle}
                  />
                ) : (
                  <SearchableDropdown
                    placeholder="Select City"
                    options={cityOptions}
                    value={formData.city}
                    onChange={handleCityChange}
                    disabled={!selectedStateCode}
                    displayKey="name"
                    valueKey={null}
                  />
                )}
              </div>

              <input
                required
                name="zipCode"
                value={formData.zipCode}
                onChange={handleChange}
                type="text"
                placeholder="Zip code"
                className={inputStyle}
              />

              <input
                required
                name="phone"
                value={formData.phone}
                type="tel"
                placeholder="Phone (10 digits)"
                className={inputStyle}
                maxLength={10}
                onInput={(e) => {
                  e.target.value = e.target.value
                    .replace(/[^0-9]/g, "")
                    .slice(0, 10);
                  handleChange(e);
                }}
              />
            </div>
          </div>

          {/* ── Right: Order Summary ── */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl border border-gray-100 shadow-lg overflow-hidden sticky top-24"
            >
              <div className="p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-5 flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-[#e84825]" /> Order Summary
                </h2>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between text-gray-600 border-b border-gray-50 pb-3">
                    <span>Subtotal</span>
                    <span className="font-semibold text-gray-900">
                      ₹{totalPrice.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-600 border-b border-gray-50 pb-3">
                    <span>Delivery Fee</span>
                    <span
                      className={`font-semibold ${
                        DELIVERY_FEE === 0 ? "text-green-600" : "text-gray-900"
                      }`}
                    >
                      {DELIVERY_FEE === 0 ? "FREE" : `₹${DELIVERY_FEE}`}
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-600 border-b border-gray-50 pb-3">
                    <span>Platform Fee</span>
                    <span className="font-semibold text-gray-900">
                      ₹{PLATFORM_FEE}
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-600 border-b border-gray-50 pb-3">
                    <span>Packing Charge</span>
                    <span className="font-semibold text-gray-900">
                      ₹{PACKING}
                    </span>
                  </div>
                  <div className="flex justify-between text-base font-bold text-gray-900 pt-1">
                    <span>Total</span>
                    <span className="text-xl">₹{GRAND_TOTAL.toFixed(2)}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-6 bg-gradient-to-r from-[#e84825] to-[#ff6b4a] text-white py-3.5 rounded-xl font-bold text-sm shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    "Proceed To Payment →"
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => navigate("/cart")}
                  className="w-full mt-3 py-2.5 text-gray-400 hover:text-gray-600 text-sm font-medium transition-colors"
                >
                  ← Back to Cart
                </button>
              </div>

              {totalPrice < 500 && totalPrice > 0 && (
                <div className="border-t border-gray-100 p-4 bg-orange-50">
                  <p className="text-xs text-[#e84825] font-medium text-center">
                    Add ₹{(500 - totalPrice).toFixed(0)} more for FREE delivery!
                  </p>
                  <div className="h-1.5 bg-orange-100 rounded-full mt-2 overflow-hidden">
                    <div
                      className="h-full bg-[#e84825] rounded-full transition-all"
                      style={{
                        width: `${Math.min((totalPrice / 500) * 100, 100)}%`,
                      }}
                    />
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddressForm;
