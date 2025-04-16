
import { Leaf, Facebook, Twitter, Instagram, Github } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-eco-dark text-white">
      <div className="container mx-auto px-4 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Leaf className="h-6 w-6" />
              <span className="font-bold text-xl">EcoTracker</span>
            </div>
            <p className="text-gray-300 mb-4">
              Track your eco-friendly actions, earn rewards, and make a meaningful impact on our planet.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-white">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-300 hover:text-white">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-300 hover:text-white">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-300 hover:text-white">
                <Github className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-white">Home</Link>
              </li>
             
              <li>
                <Link to="/marketplace" className="text-gray-300 hover:text-white">Marketplace</Link>
              </li>
              <li>
                <Link to="/action" className="text-gray-300 hover:text-white">Log Action</Link>
              </li>
              <li>
                <Link to="/profile" className="text-gray-300 hover:text-white">Profile</Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-300 hover:text-white">Blog</a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white">Help Center</a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white">Community</a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white">Partners</a>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-4">Contact Us</h3>
            <p className="text-gray-300 mb-4">
              Have questions or suggestions? We'd love to hear from you.
            </p>
            <a href="mailto:contact@ecotracker.com" className="text-eco-medium hover:text-eco-light">
              contact@ecotracker.com
            </a>
          </div>
        </div>
        
        <div className="border-t border-gray-700 pt-8 mt-8 text-center">
          <p className="text-gray-900 text-sm">
            © {new Date().getFullYear()} EcoTracker. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
