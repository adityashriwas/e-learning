const Footer = () => {
  return (
    <footer className="mt-8 w-full bg-gray-900 text-gray-200">
      <div className="mx-auto w-full max-w-7xl px-4 py-8">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <h3 className="text-lg font-semibold">E-Learning</h3>
            <p className="text-sm text-gray-400">
              Learn from anywhere - curated courses by experts.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium">Product</h4>
              <ul className="mt-2 text-sm text-gray-400">
                <li>Courses</li>
                <li>Course Progress</li>
              </ul>
            </div>

            <div>
              <h4 className="font-medium">Company</h4>
              <ul className="mt-2 text-sm text-gray-400">
                <li>About</li>
                <li>Contact</li>
              </ul>
            </div>
          </div>

          <div className="text-sm text-gray-400 lg:text-right">
            <p>&copy; {new Date().getFullYear()} E-Learning. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
