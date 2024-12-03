export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-teal-50 to-blue-50 shadow-lg rounded-t-lg">
      <div className="container mx-auto px-6 py-10 md:py-16">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-8 md:space-y-0">
          {/* Logo và mô tả */}
          <div className="text-center md:text-left">
            <img
              src="https://caodang.fpt.edu.vn/wp-content/uploads/logo-3.png"
              alt="Logo"
              className="w-32 mx-auto md:mx-0"
            />
            <p className="text-gray-700 mt-4">
              Providing quality education since 2000
            </p>
          </div>

          {/* Navigation */}
          <nav className="flex flex-wrap justify-center md:justify-end gap-6 text-gray-700">
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

        {/* Phần bản quyền */}
        <div className="mt-12 pt-6 border-t border-gray-200 text-center">
          <p className="text-gray-600 text-sm">
            © {new Date().getFullYear()} <span className="font-semibold">HOPE</span>. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
