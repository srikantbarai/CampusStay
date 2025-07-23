import React from 'react';

const LandingPage = () => {
  return (
    <div className="bg-gray-100 font-sans">
      {/* Navbar */}
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600">HostelMS</h1>
          <div className="space-x-4">
            <a href="#" className="text-gray-700 hover:text-blue-600">Home</a>
            <a href="#" className="text-gray-700 hover:text-blue-600">Features</a>
            <a href="#" className="text-gray-700 hover:text-blue-600">Contact</a>
            <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Login</button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-blue-100 py-20">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-blue-800 mb-4">
            Welcome to Your Hostel Manager
          </h2>
          <p className="text-gray-700 mb-6 text-lg">
            A smart way to manage rooms, students, cycles, repairs, and more in your campus hostel.
          </p>
          <div className="space-x-4">
            <button className="bg-blue-600 text-white px-6 py-3 rounded-full hover:bg-blue-700">
              Get Started
            </button>
            <button className="border border-blue-600 text-blue-600 px-6 py-3 rounded-full hover:bg-blue-50">
              Learn More
            </button>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <h3 className="text-3xl font-semibold text-center text-gray-800 mb-6">
            About Our System
          </h3>
          <p className="text-gray-700 text-center leading-relaxed max-w-3xl mx-auto">
            Our Hostel Management System is designed to streamline and automate all aspects of hostel
            operations—from student allocation to cycle tracking and repair management. Built for students
            and hostel staff to ensure transparency, ease, and efficiency.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-6">
        <div className="max-w-5xl mx-auto text-center">
          <p>&copy; 2025 Hostel Management System. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
