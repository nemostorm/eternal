'use client';

import { useState, useMemo, useEffect } from 'react';
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { BlogCard } from "../components/BlogCard";
import { blogPosts } from '@/lib/posts';

// Typewriter component
function Typewriter({ text, speed = 50 }: { text: string; speed?: number }) {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, speed);

      return () => clearTimeout(timeout);
    }
  }, [currentIndex, text, speed]);

  return <span>{displayText}<span className="animate-pulse">|</span></span>;
}

export default function Blog() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPosts = useMemo(() => {
    if (!searchTerm) return blogPosts;

    return blogPosts.filter(post =>
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.author.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-black">
      {/* Left side SVG pattern */}
      <div className="hidden lg:block absolute left-0 top-0 bottom-0 w-48 opacity-30 pointer-events-none z-0">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="left-pattern" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
              <circle cx="30" cy="30" r="2" fill="#a855f7" />
              <circle cx="0" cy="0" r="1" fill="#a855f7" opacity="0.5" />
              <circle cx="60" cy="0" r="1" fill="#a855f7" opacity="0.5" />
              <circle cx="0" cy="60" r="1" fill="#a855f7" opacity="0.5" />
              <path d="M30 0 L30 60" stroke="#a855f7" strokeWidth="0.5" opacity="0.2" />
              <path d="M0 30 L60 30" stroke="#a855f7" strokeWidth="0.5" opacity="0.2" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#left-pattern)" />
        </svg>
      </div>

      {/* Right side SVG pattern */}
      <div className="hidden lg:block absolute right-0 top-0 bottom-0 w-48 opacity-30 pointer-events-none z-0">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="right-pattern" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
              <circle cx="30" cy="30" r="2" fill="#a855f7" />
              <circle cx="0" cy="0" r="1" fill="#a855f7" opacity="0.5" />
              <circle cx="60" cy="0" r="1" fill="#a855f7" opacity="0.5" />
              <circle cx="0" cy="60" r="1" fill="#a855f7" opacity="0.5" />
              <path d="M30 0 L30 60" stroke="#a855f7" strokeWidth="0.5" opacity="0.2" />
              <path d="M0 30 L60 30" stroke="#a855f7" strokeWidth="0.5" opacity="0.2" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#right-pattern)" />
        </svg>
      </div>

      <Navbar />
      <main className="flex-1 pt-16 relative z-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-4xl font-light text-white mb-8 tracking-wider">Tech Blog</h1>
          <p className="text-lg text-gray-400 mb-12">
            <Typewriter text="Ideas, insights, and explorations across the digital landscape." speed={15} />
          </p>

          {/* Search Bar */}
          <div className="mb-8">
            <input
              type="text"
              placeholder="Search articles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full max-w-md px-4 py-2 bg-transparent border border-purple-900/30 text-white placeholder-gray-500 focus:outline-none focus:border-purple-600/60 focus:ring-2 focus:ring-purple-600/20 focus:bg-purple-900/5 transition-all duration-300 ease-out rounded-sm"
            />
          </div>

          {/* Scrollable Blog Feed */}
          <div className="relative">
            {/* Fade gradient overlay at top - hidden on large screens */}
            <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-black to-transparent pointer-events-none z-10 lg:hidden"></div>
            
            <div className="max-h-[32rem] overflow-y-auto scrollbar-thin scrollbar-thumb-purple-600/30 lg:max-h-none lg:overflow-visible">
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-4 xl:gap-3 pr-4 lg:pr-0">
                {filteredPosts.map((post, index) => (
                  <div key={index} className="animate-in fade-in slide-in-from-bottom-4 duration-300">
                    <BlogCard
                      slug={post.slug}
                      title={post.title}
                      excerpt={post.excerpt}
                      date={post.date}
                      author={post.author}
                      readTime={post.readTime}
                      category={post.category}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Fade gradient overlay at bottom - hidden on large screens */}
            <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black to-transparent pointer-events-none z-10 lg:hidden"></div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}