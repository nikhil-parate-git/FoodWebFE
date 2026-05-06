import logo from "../assets/frontend_assets/logo.png";
import { FaFacebookF, FaTwitter, FaInstagram } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-[#1a1a1a] text-gray-500">
      {/* ── MAIN ROW ── */}
      <div className="max-w-7xl mx-auto px-8 py-10 flex flex-col md:flex-row items-start justify-between gap-10">
        {/* Brand */}
        <div className="flex flex-col gap-3 max-w-xs">
          <img
            src={logo}
            alt="Tomato"
            className="h-7 w-auto brightness-0 invert"
          />
          <p className="text-xs leading-relaxed">
            Fresh flavors, fast delivery — right to your door.
          </p>
          <div className="flex items-center gap-2 mt-1">
            {[FaFacebookF, FaTwitter, FaInstagram].map((Icon, i) => (
              <a
                key={i}
                href="#"
                className="w-8 h-8 rounded-full border border-gray-700 flex items-center justify-center hover:bg-[#e84825] hover:border-[#e84825] hover:text-white transition-all duration-200"
              >
                <Icon size={12} />
              </a>
            ))}
          </div>
        </div>

        {/* Company Links */}
        <div className="flex flex-col gap-2">
          <h3 className="text-white text-xs font-semibold uppercase tracking-widest mb-1">
            Company
          </h3>
          {["Home", "About Us", "Delivery", "Privacy Policy"].map((link) => (
            <a
              key={link}
              href="#"
              className="text-xs hover:text-[#e84825] transition-colors duration-200"
            >
              {link}
            </a>
          ))}
        </div>

        {/* Contact */}
        <div className="flex flex-col gap-2">
          <h3 className="text-white text-xs font-semibold uppercase tracking-widest mb-1">
            Get in Touch
          </h3>
          {["contact@tomato.com", "+1-800-TOMATO"].map((item) => (
            <span key={item} className="text-xs">
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* ── BOTTOM BAR ── */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-8 py-4 flex items-center justify-center">
          <p className="text-xs text-gray-700">
            © {new Date().getFullYear()} Tomato. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
