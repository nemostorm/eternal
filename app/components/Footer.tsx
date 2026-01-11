'use client';

export function Footer() {
  return (
    <footer className="bg-black border-t border-purple-900/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <span className="text-xl font-light text-white tracking-wider">Eternal</span>
            </div>
            <p className="text-gray-500 text-sm max-w-md">
              Deep dives into software engineering, design patterns, and cutting-edge technology.
            </p>
          </div>

          <div>
            <h3 className="text-white text-sm font-medium mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-500 hover:text-purple-300 text-sm transition-colors duration-200">Home</a></li>
              <li><a href="#" className="text-gray-500 hover:text-purple-300 text-sm transition-colors duration-200">Articles</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-purple-900/20">
          <p className="text-center text-gray-600 text-sm">
            2024 Eternal. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
