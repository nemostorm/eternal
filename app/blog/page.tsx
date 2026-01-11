'use client';

import { useState, useMemo } from 'react';
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { BlogCard } from "../components/BlogCard";
import { blogPosts } from '@/lib/posts';

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
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 bg-black pt-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-4xl font-light text-white mb-8 tracking-wider">Tech Blog</h1>
          <p className="text-lg text-gray-400 mb-12">
            Ideas, insights, and explorations across the digital landscape.
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
          <div className="max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-purple-600/30">
            <div className="space-y-6 pr-4">
              {filteredPosts.map((post, index) => (
                <BlogCard
                  key={index}
                  slug={post.slug}
                  title={post.title}
                  excerpt={post.excerpt}
                  date={post.date}
                  author={post.author}
                  readTime={post.readTime}
                  category={post.category}
                />
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}