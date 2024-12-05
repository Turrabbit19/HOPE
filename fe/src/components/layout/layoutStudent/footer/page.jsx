export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-teal-50 to-blue-50 shadow-lg">
      <div className="max-w-full px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center space-y-4 sm:flex-row sm:justify-between sm:space-y-0">
          {/* Logo and description */}
          <div className="text-center sm:text-left">
            <img
              src="https://caodang.fpt.edu.vn/wp-content/uploads/logo-3.png"
              alt="Logo"
              className="w-24 sm:w-32 mx-auto sm:mx-0"
            />
            <p className="text-gray-700 text-sm mt-2">
              Providing quality education since 2000
            </p>
          </div>

          {/* Navigation */}
          <nav className="flex flex-wrap justify-center gap-4 text-sm text-gray-700">
            <a href="#" className="hover:text-teal-600 transition duration-300">
              Home
            </a>
            <a href="#" className="hover:text-teal-600 transition duration-300">
              About Us
            </a>
            <a href="#" className="hover:text-teal-600 transition duration-300">
              Services
            </a>
            <a href="#" className="hover:text-teal-600 transition duration-300">
              Contact
            </a>
          </nav>
        </div>

        {/* Copyright section */}
        <div className="mt-6 pt-4 border-t border-gray-200 text-center">
          <p className="text-gray-600 text-xs">
            © {new Date().getFullYear()} <span className="font-semibold">HOPE</span>. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

