import React from 'react';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin, Clock, ExternalLink } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-teal-50 to-blue-50 shadow-lg">
        <div className="max-w-full px-4 py-6 sm:px-6 lg:px-8">
            <div className="flex flex-col items-center space-y-4 sm:flex-row sm:justify-between sm:space-y-0">
                {/* Logo and description */}
                <div className="text-center sm:text-left">
                    <img
                        src="/public/assets/img/download (10).jpg"
                        alt="Logo"
                        width={50}
                    />
                    <p className="text-gray-700 text-xl mt-2">
                        Providing quality education since 2000
                    </p>
                </div>

                {/* Navigation */}
                <nav className="flex flex-wrap justify-center gap-4 text-xl text-gray-700">
                    <a
                        href="#"
                        className="hover:text-teal-600 transition duration-300"
                    >
                        Home
                    </a>
                    <a
                        href="#"
                        className="hover:text-teal-600 transition duration-300"
                    >
                        About Us
                    </a>
                    <a
                        href="#"
                        className="hover:text-teal-600 transition duration-300"
                    >
                        Services
                    </a>
                    <a
                        href="#"
                        className="hover:text-teal-600 transition duration-300"
                    >
                        Contact
                    </a>
                </nav>
            </div>

            {/* Copyright section */}
            <div className="mt-6 pt-4 border-t border-gray-200 text-center">
                <p className="text-gray-600 text-2xl">
                    © {new Date().getFullYear()}{" "}
                    <span className="font-semibold">HOPE</span>. All rights
                    reserved.
                </p>
            </div>
        </div>
    </footer>
);
}

const SocialIcon = ({ Icon, href }) => (
  <a 
    href={href} 
    className="text-gray-600 hover:text-teal-600 transition duration-300"
    target="_blank" 
    rel="noopener noreferrer"
  >
    <Icon size={24} />
  </a>
);

const FooterLink = ({ href, children }) => (
  <a 
    href={href} 
    className="text-gray-600 hover:text-teal-600 transition duration-300 flex items-center"
  >
    <ExternalLink size={14} className="mr-1" />
    {children}
  </a>
);

const ContactInfo = ({ Icon, text }) => (
  <div className="flex items-center space-x-3 text-gray-600">
    <Icon size={18} className="text-teal-600" />
    <span>{text}</span>
  </div>
);

