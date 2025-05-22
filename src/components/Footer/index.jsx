import { FaFacebookF, FaInstagram } from "react-icons/fa";
import { IoLogoLinkedin, IoLogoYoutube } from "react-icons/io5";
import { Link } from "react-router-dom";
import {
  FcShipped,
  FcMoneyTransfer,
  FcAssistant,
  FcBusinessman,
} from "react-icons/fc";

const Footer = () => {
  const footerSections = [
    {
      title: "About Us",
      links: [
        { name: "Our Story", path: "/Our-Story" },
        { name: "Privacy Policy", path: "/Privacy-Policy" },
        { name: "Shipping Policy", path: "/Shipping-Policy" },
        { name: "Terms & Conditions", path: "/Terms-Conditions" },
        { name: "Return & Exchange Policy", path: "/Return-Exchange-Policy" },
      ],
    },
    {
      title: "Need Help?",
      links: [
        { name: "Track order", path: "/track-order" },
        { name: "International Shipping", path: "/shipping-info" },
      ],
    },
    {
      title: "Useful Links",
      links: [
        { name: "Category", path: "/category" },
        { name: "Products", path: "/products" },
        { name: "Collection", path: "/" },
        { name: "Wishlist", path: "/" },
        { name: "Blogs", path: "/" },
        { name: "Contact Us", path: "/" },
      ],
    },
    {
      title: "Category Collection",
      links: [
        { name: "Handmade printing", path: "/" },
        { name: "Marble Products", path: "/" },
        { name: "Digital Printing", path: "/" },
        { name: "Resin", path: "/" },
        { name: "Wooden", path: "/" },
        { name: "Showpiece", path: "/" },
      ],
    },
    {
      title: "Reach Us",
      links: [
        { name: "Support@blista.in", path: "mailto:support@blista.in" },
        { name: "+91 2655235621", path: "tel:+912655235621" },
        { name: "Our Address", path: "/contact" },
        { name: "Working Hours 10AM - 7 PM", path: "#" },
      ],
    },
  ];

  const highlights = [
    {
      icon: <FcShipped size={45} />,
      title: "Free Shipping",
      desc: "Shipping Simplified.",
    },
    {
      icon: <FcAssistant size={45} />,
      title: "24/7 Support",
      desc: "Assistance Always Available.",
    },
    {
      icon: <FcMoneyTransfer size={45} />,
      title: "Online Payment",
      desc: "Secure Transactions.",
    },
    {
      icon: <FcBusinessman size={45} />,
      title: "Fast Delivery",
      desc: "Swift Shipping Guaranteed.",
    },
  ];

  return (
    <footer className="bg-[#051747] w-full text-[#E4E7EC] font-sans">
      <div className="max-w-screen-xl mx-auto px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-10 text-center">
          {highlights.map((item, index) => (
            <div
              key={index}
              className="flex items-center bg-[#162447] p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300"
            >
              <div className="min-w-[60px] min-h-[60px] flex items-center justify-center rounded-full bg-[#FFAB76] shadow-md mr-6">
                {item.icon}
              </div>
              <div className="text-left">
                <h3 className="text-white font-semibold text-lg mb-1">
                  {item.title}
                </h3>
                <p className="text-[#CBD5E1] text-sm">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 xsm:grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          {footerSections.map((section, i) => (
            <div key={i}>
              <h2 className="text-md text-soft uppercase font-bold mb-2 tracking-wider">
                {section.title}
              </h2>
              <ul className="space-y-2 text-sm text-gray-400 tracking-wide">
                {section.links.map((link, j) => (
                  <li key={j}>
                    {link.path.startsWith("http") ||
                    link.path.startsWith("mailto:") ||
                    link.path.startsWith("tel:") ? (
                      <a
                        href={link.path}
                        className="hover:text-[#FFAB76] transition tracking-wider"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {link.name}
                      </a>
                    ) : (
                      <Link
                        to={link.path}
                        className="hover:text-[#FFAB76] transition tracking-wider"
                      >
                        {link.name}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="text-center mb-10 mt-4">
          <h2 className="text-lg sm:text-xl text-soft font-bold mb-2 tracking-wider">
            Subscribe to our Newsletter
          </h2>
          <p className="text-sm text-[#D0D5DD] mb-4 tracking-wider">
            Stay up to date with our latest collections and offers.
          </p>
          <div className="max-w-md mx-auto flex bg-[#1C1F2A] rounded-full overflow-hidden shadow-md">
            <input
              type="email"
              placeholder="Your email address"
              className="flex-1 px-4 py-2 text-white bg-transparent outline-none placeholder-gray-400"
            />
            <button className="bg-[#38bdf8] px-6 py-2 text-white font-semibold hover:bg-[#0ea5e9] transition">
              Subscribe
            </button>
          </div>
        </div>
        <div className="pt-6 border-t border-[#1F2937] flex flex-col sm:flex-row sm:items-center sm:justify-between text-sm text-[#A0AEC0] font-medium gap-4">
          <span className="text-center sm:text-left tracking-widest">
            © {new Date().getFullYear()} Blissta. All Rights Reserved.
          </span>
          <div className="flex justify-center sm:justify-end gap-5 text-xl text-[#E4E7EC]">
            <a
              href="https://www.instagram.com/"
              target="_blank"
              className="hover:text-[#FFAB76]"
              aria-label="Instagram"
            >
              <FaInstagram />
            </a>
            <a
              href="https://www.facebook.com/"
              target="_blank"
              className="hover:text-[#FFAB76]"
              aria-label="Facebook"
            >
              <FaFacebookF />
            </a>
            <a
              href="https://in.linkedin.com/"
              target="_blank"
              className="hover:text-[#FFAB76]"
              aria-label="LinkedIn"
            >
              <IoLogoLinkedin />
            </a>
            <a
              href="https://www.youtube.com/"
              target="_blank"
              className="hover:text-[#FFAB76]"
              aria-label="YouTube"
            >
              <IoLogoYoutube />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
