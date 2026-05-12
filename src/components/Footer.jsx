import logo from "../assets/frontend_assets/logo.png";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
} from "react-icons/fa";

export default function Footer() {
  const companyLinks = ["Home", "About Us", "Menu", "My Orders"];

  return (
    <footer className="bg-[#111827] text-gray-300 mt-16 overflow-hidden">
      {/* TOP SECTION */}
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        {/* BRAND */}
        <div>
          <img
            src={logo}
            alt="Tomato"
            className="h-9 w-auto brightness-0 invert mb-5"
          />

          <p className="text-sm leading-7 text-gray-400 max-w-sm">
            Fresh flavors and lightning-fast delivery right at your doorstep.
            Experience delicious meals crafted with love and delivered hot.
          </p>

          {/* SOCIAL */}
          <div className="flex items-center gap-3 mt-6">
            {[FaFacebookF, FaTwitter, FaInstagram].map((Icon, i) => (
              <a
                key={i}
                href="#"
                className="w-10 h-10 rounded-full border border-gray-700 flex items-center justify-center text-gray-300 hover:bg-[#e84825] hover:border-[#e84825] hover:text-white transition-all duration-300"
              >
                <Icon size={14} />
              </a>
            ))}
          </div>
        </div>

        {/* COMPANY */}
        <div>
          <h3 className="text-white text-lg font-semibold mb-5">Company</h3>

          <ul className="space-y-3">
            {companyLinks.map((link) => (
              <li key={link}>
                <a
                  href="#"
                  className="text-sm text-gray-400 hover:text-[#e84825] transition-all duration-200"
                >
                  {link}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* SUPPORT */}
        <div>
          <h3 className="text-white text-lg font-semibold mb-5">Support</h3>

          <ul className="space-y-3">
            {["Help Center", "FAQs", "Terms & Conditions", "Refund Policy"].map(
              (item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="text-sm text-gray-400 hover:text-[#e84825] transition-all duration-200"
                  >
                    {item}
                  </a>
                </li>
              ),
            )}
          </ul>
        </div>

        {/* CONTACT */}
        <div>
          <h3 className="text-white text-lg font-semibold mb-5">
            Get in Touch
          </h3>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center text-[#e84825] flex-shrink-0">
                <FaMapMarkerAlt size={13} />
              </div>

              <p className="text-sm text-gray-400 leading-6">
                123 Road, SitaBurdi,
                <br />
                Nagpur, Maharashtra
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center text-[#e84825] flex-shrink-0">
                <FaPhoneAlt size={12} />
              </div>

              <p className="text-sm text-gray-400">+91 98765 43210</p>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center text-[#e84825] flex-shrink-0">
                <FaEnvelope size={12} />
              </div>

              <p className="text-sm text-gray-400">contact@tomato.com</p>
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM BAR */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-sm text-gray-500 text-center sm:text-left">
            © {new Date().getFullYear()} Tomato. All rights reserved.
          </p>

          <div className="flex items-center gap-5">
            {["Privacy", "Terms", "Cookies"].map((item) => (
              <a
                key={item}
                href="#"
                className="text-sm text-gray-500 hover:text-[#e84825] transition-all duration-200"
              >
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
