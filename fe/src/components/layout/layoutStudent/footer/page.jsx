import React from 'react';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin, Clock, ExternalLink } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-teal-100 to-blue-100 shadow-lg">
      <div className=" mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Logo and description */}
          <div className="text-center md:text-left col-span-1 md:col-span-2 lg:col-span-1">
            <img
              src="/public/assets/img/download (10).jpg"
              alt="Logo"
              className="w-32 mx-auto md:mx-0 mb-2"
            />
            <p className="text-gray-700 text-xl mb-3">
              Empowering minds, shaping futures. Quality education since 2000.
            </p>
            <div className="flex justify-center md:justify-start space-x-4">
              <SocialIcon Icon={Facebook} href="#" />
              <SocialIcon Icon={Twitter} href="#" />
              <SocialIcon Icon={Instagram} href="#" />
              <SocialIcon Icon={Linkedin} href="#" />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Quick Links</h3>
            <nav className="flex flex-col space-y-1 text-xl">
              <FooterLink href="#">Home</FooterLink>
              <FooterLink href="#">About Us</FooterLink>
              <FooterLink href="#">Academic Programs</FooterLink>
              <FooterLink href="#">Admissions</FooterLink>
              <FooterLink href="#">Student Life</FooterLink>
              <FooterLink href="#">Research</FooterLink>
            </nav>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Contact Us</h3>
            <div className="space-y-2 text-xl">
              <ContactInfo Icon={MapPin} text="123 Education St, City, Country" />
              <ContactInfo Icon={Phone} text="+1 (123) 456-7890" />
              <ContactInfo Icon={Mail} text="info@hope.edu" />
              <ContactInfo Icon={Clock} text="Mon-Fri: 8:00 AM - 5:00 PM" />
            </div>
          </div>

          {/* Newsletter Signup */}
          <div className="col-span-1 md:col-span-2 lg:col-span-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Stay Connected</h3>
            <p className="text-gray-700 text-xl mb-2">Subscribe to our newsletter.</p>
            <form className="flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                placeholder="Your email address"
                className="flex-grow px-3 py-1 text-xl rounded-md border-gray-300 focus:border-teal-500 focus:ring-teal-500"
              />
              <button
                type="submit"
                className="bg-teal-600 text-white px-4 py-1 text-xl rounded-md hover:bg-teal-700 transition duration-300"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Divider */}
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center">
            {/* Copyright section */}
            <p className="text-gray-600 text-xs mb-2 md:mb-0">
              © {new Date().getFullYear()} <span className="font-semibold">HOPE University</span>. All rights reserved.
            </p>
            {/* Additional Links */}
            <div className="flex space-x-4 text-xs">
              <FooterLink href="#">Privacy Policy</FooterLink>
              <FooterLink href="#">Terms of Service</FooterLink>
              <FooterLink href="#">Sitemap</FooterLink>
            </div>
          </div>
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

