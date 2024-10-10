export default function Footer() {
    return (
      <footer className="bg-gray-100">
        <div className="max-w-6xl mx-auto px-4 py-10 md:py-20">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
            <div className="flex flex-col items-center md:items-start">
            <img src="https://caodang.fpt.edu.vn/wp-content/uploads/logo-3.png" alt="" />
              <p className="text-sm text-gray-600 text-center md:text-left">
                Providing quality education since 2000
              </p>
            </div>
            
            <nav className="flex flex-wrap justify-center md:justify-end gap-x-8 gap-y-4 text-sm">
              <a href="#" className="hover:text-primary transition-colors">Home</a>
              <a href="#" className="hover:text-primary transition-colors">About Us</a>
              <a href="#" className="hover:text-primary transition-colors">Services</a>
              <a href="#" className="hover:text-primary transition-colors">Contact</a>
            </nav>
          </div>
          
          <div className="mt-8 pt-8 border-t border-gray-200 text-sm text-center text-gray-600">
            © {new Date().getFullYear()} Your Company Name. All rights reserved.
          </div>
        </div>
      </footer>
    )
  }