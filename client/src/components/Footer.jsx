import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-200 mt-8">
      <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h3 className="text-lg font-semibold">E-Learning</h3>
          <p className="text-sm text-gray-400">Learn from anywhere — curated courses by experts.</p>
        </div>

        <div className="flex gap-6">
          <div>
            <h4 className="font-medium">Product</h4>
            <ul className="text-sm text-gray-400 mt-2">
              <li>Courses</li>
              <li>Course Progress</li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium">Company</h4>
            <ul className="text-sm text-gray-400 mt-2">
              <li>About</li>
              <li>Contact</li>
            </ul>
          </div>
        </div>

        <div className="text-sm text-gray-400">
          <p>&copy; {new Date().getFullYear()} E-Learning. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
