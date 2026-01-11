'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleSubscribe = () => {
    alert('Thanks for your interest! Newsletter signup coming soon.');
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-sm border-b border-purple-900/20 animate-in slide-in-from-top-2 duration-500" ref={menuRef}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-2">
            <Link href="/blog" className="text-xl font-light text-white tracking-wider hover:text-purple-200 transition-colors duration-200">Eternal</Link>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-sm text-gray-400 hover:text-white hover:scale-105 transition-all duration-200">Home</Link>
            <Link href="/blog" className="text-sm text-gray-400 hover:text-white hover:scale-105 transition-all duration-200">Articles</Link>
          </div>

          <div className="flex items-center space-x-4">
            <button 
              onClick={handleSubscribe}
              className="cursor-pointer hidden md:block px-4 py-2 text-sm border border-purple-600/30 text-purple-200 hover:border-purple-600/60 hover:text-white hover:bg-purple-600/10 hover:scale-105 transition-all duration-200 rounded-sm"
            >
              Subscribe
            </button>

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden px-3 py-1.5 text-sm border border-purple-600/30 text-purple-200 hover:border-purple-600/60 hover:text-white transition-all duration-200 rounded-sm"
              aria-label="Toggle menu"
            >
              Menu
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <div
        className={`md:hidden absolute top-16 right-4 w-56 bg-black/95 backdrop-blur-sm border border-purple-900/20 rounded-lg shadow-xl transition-all duration-300 ease-in-out ${
          isMenuOpen
            ? 'opacity-100 translate-y-0 pointer-events-auto'
            : 'opacity-0 -translate-y-2 pointer-events-none'
        }`}
      >
        <div className="py-2">
          <Link
            href="/"
            className="block px-4 py-2 text-sm text-gray-400 hover:text-white hover:bg-purple-600/10 transition-all duration-200"
            onClick={() => setIsMenuOpen(false)}
          >
            Home
          </Link>
          <Link
            href="/blog"
            className="block px-4 py-2 text-sm text-gray-400 hover:text-white hover:bg-purple-600/10 transition-all duration-200"
            onClick={() => setIsMenuOpen(false)}
          >
            Articles
          </Link>
          <div className="border-t border-purple-900/20 my-2"></div>
          <button
            onClick={() => {
              handleSubscribe();
              setIsMenuOpen(false);
            }}
            className="w-full text-left px-4 py-2 text-sm text-purple-200 hover:text-white hover:bg-purple-600/10 transition-all duration-200"
          >
            Subscribe
          </button>
        </div>
      </div>
    </nav>
  );
}
