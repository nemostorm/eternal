'use client';

import Link from 'next/link';

interface BlogCardProps {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  author: string;
  readTime: string;
  category: string;
}

export function BlogCard({ slug, title, excerpt, date, author, readTime, category }: BlogCardProps) {
  return (
    <Link href={`/blog/${slug}`}>
      <div className="p-[1px] bg-gradient-to-r from-purple-900/30 to-transparent rounded-sm cursor-pointer hover:from-purple-700/70 transition-all duration-500 ease-in-out mb-6">
        <article className="bg-black rounded-sm transition-colors duration-500 ease-in-out">
          <div className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-purple-400 uppercase tracking-wider">{category}</span>
              <span className="text-xs text-gray-500">{readTime}</span>
            </div>

            <h2 className="text-lg font-light text-white mb-2">
              {title}
            </h2>

            <p className="text-gray-400 text-sm leading-relaxed mb-3 line-clamp-2">
              {excerpt}
            </p>

            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>{author}</span>
              <span>{date}</span>
            </div>
          </div>
        </article>
      </div>
    </Link>
  );
}
