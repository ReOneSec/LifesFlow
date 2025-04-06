import React from 'react';
import { User, Mail, Globe, MapPin, Briefcase, Github, Twitter, Facebook, Instagram, MessageSquare } from 'lucide-react';

function AboutDeveloper() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Header/Banner Section */}
          <div className="h-48 bg-gradient-to-r from-red-600 to-red-800"></div>
          
          {/* Profile Section */}
          <div className="relative px-6 -mt-20">
            <div className="flex flex-col items-center">
              <div className="w-32 h-32 bg-white rounded-full p-2 shadow-lg">
                <div className="w-full h-full bg-gray-200 rounded-full flex items-center justify-center">
                  <User className="w-16 h-16 text-gray-400" />
                </div>
              </div>
              <h1 className="mt-4 text-3xl font-bold text-gray-900">SAHABAJ ALAM</h1>
              <p className="text-gray-600 mt-1">Full Stack Developer</p>
            </div>

            {/* Bio Section */}
            <div className="mt-8 text-center">
              <p className="text-gray-600 max-w-2xl mx-auto">
                Passionate full-stack developer with expertise in modern web technologies.
                Dedicated to creating efficient, scalable, and user-friendly applications
                that make a positive impact on people's lives.
              </p>
            </div>

            {/* Contact Info */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-red-600" />
                <span className="text-gray-600">support@lifesflow.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <Globe className="w-5 h-5 text-red-600" />
                <span className="text-gray-600">www.lifesflow.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="w-5 h-5 text-red-600" />
                <span className="text-gray-600">West Bengal, India</span>
              </div>
              <div className="flex items-center space-x-3">
                <Briefcase className="w-5 h-5 text-red-600" />
                <span className="text-gray-600">Lifesflow Blood Bank</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="mt-8 border-t border-gray-200 pt-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Connect with me</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <a
                  href="https://github.com/ReOneSec"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 text-gray-700 hover:text-red-600 transition-colors duration-200"
                >
                  <Github className="w-5 h-5" />
                  <span>GitHub</span>
                </a>
                <a
                  href="http://x.com/cryptosahabaj"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 text-gray-700 hover:text-red-600 transition-colors duration-200"
                >
                  <Twitter className="w-5 h-5" />
                  <span>Twitter</span>
                </a>
                <a
                  href="https://www.facebook.com/SAHABAJalam23799"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 text-gray-700 hover:text-red-600 transition-colors duration-200"
                >
                  <Facebook className="w-5 h-5" />
                  <span>Facebook</span>
                </a>
                <a
                  href="http://instagram.com/nxt_sahabaj"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 text-gray-700 hover:text-red-600 transition-colors duration-200"
                >
                  <Instagram className="w-5 h-5" />
                  <span>Instagram</span>
                </a>
                <a
                  href="https://discordapp.com/users/cryptosahabaj"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 text-gray-700 hover:text-red-600 transition-colors duration-200"
                >
                  <MessageSquare className="w-5 h-5" />
                  <span>Discord</span>
                </a>
                <a
                  href="https://t.me/ViperROX"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 text-gray-700 hover:text-red-600 transition-colors duration-200"
                >
                  <MessageSquare className="w-5 h-5" />
                  <span>Telegram</span>
                </a>
              </div>
            </div>

            {/* Skills Section */}
            <div className="mt-8 border-t border-gray-200 pt-8 pb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Skills & Technologies</h2>
              <div className="flex flex-wrap gap-2">
                {['React', 'TypeScript', 'Node.js', 'MongoDB', 'PostgreSQL', 'Tailwind CSS', 'Next.js', 'GraphQL', 'Docker', 'AWS'].map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AboutDeveloper;