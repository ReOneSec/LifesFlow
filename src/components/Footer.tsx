import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Facebook, Github, Mail, MessageCircle } from 'lucide-react';

function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">About</h3>
            <ul className="space-y-2">
              <li><Link to="/mission" className="hover:text-red-400">Our Mission</Link></li>
              <li><Link to="/team" className="hover:text-red-400">Team</Link></li>
              <li><Link to="/blog" className="hover:text-red-400">Blog</Link></li>
              <li><Link to="/news" className="hover:text-red-400">News</Link></li>
              <li><Link to="/about-developer" className="hover:text-red-400">About Developer</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Help</h3>
            <ul className="space-y-2">
              <li><Link to="/faqs" className="hover:text-red-400">FAQs</Link></li>
              <li><Link to="/contact" className="hover:text-red-400">Contact Us</Link></li>
              <li><Link to="/privacy" className="hover:text-red-400">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-red-400">Terms of Service</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Connect With Us</h3>
            <div className="flex space-x-4">
              <a href="http://instagram.com/nxt_sahabaj" target="_blank" rel="noopener noreferrer" className="hover:text-red-400">
                <Instagram />
              </a>
              <a href="https://www.facebook.com/SAHABAJalam23799" target="_blank" rel="noopener noreferrer" className="hover:text-red-400">
                <Facebook />
              </a>
              <a href="http://github.com/ReOneSec" target="_blank" rel="noopener noreferrer" className="hover:text-red-400">
                <Github />
              </a>
              <a href="mailto:support@lifesflow.com" className="hover:text-red-400">
                <Mail />
              </a>
              <a href="https://t.me/ViperROX" target="_blank" rel="noopener noreferrer" className="hover:text-red-400">
                <MessageCircle />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Emergency Contact</h3>
            <p className="text-red-400 font-bold">1-800-RED-CROSS</p>
            <p className="mt-2 text-sm">Available 24/7 for emergencies</p>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-gray-700 text-center">
          <p>&copy; {new Date().getFullYear()} Lifesflow Blood Bank. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;