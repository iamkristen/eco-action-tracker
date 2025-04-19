import { Leaf } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-eco-dark text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center space-x-2">
            <Leaf className="h-6 w-6" />
            <span className="font-bold text-xl">EcoTracker</span>
          </div>

          <nav className="flex space-x-6 text-sm">
            <Link to="/" className="text-gray-300 hover:text-white">
              Home
            </Link>
            <Link to="/marketplace" className="text-gray-300 hover:text-white">
              Marketplace
            </Link>
            <Link to="/rewards" className="text-gray-300 hover:text-white">
              Rewards
            </Link>
          </nav>

          <div className="text-center md:text-right text-sm">
            <p className="text-gray-300">Contact us at</p>
            <a
              href="mailto:contact@ecotracker.com"
              className="text-eco-medium hover:text-eco-light"
            >
              contact@ravikushwaha.co.uk
            </a>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-500 text-xs">
          © {new Date().getFullYear()} Eco Action Tracker. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
