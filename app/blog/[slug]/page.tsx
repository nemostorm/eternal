'use client';

import { useParams } from 'next/navigation';
import { useMemo, useEffect } from 'react';
import hljs from 'highlight.js';
import 'highlight.js/styles/github-dark.css';
import { Navbar } from "../../components/Navbar";
import { Footer } from "../../components/Footer";
import Link from 'next/link';
import { blogPosts, BlogPost } from '@/lib/posts';

export default function BlogPostPage() {
  const params = useParams();
  const slug = params.slug as string;
  
  const post = blogPosts.find(p => p.slug === slug);

  const htmlContent = useMemo(() => {
    if (!post) return '';
    
    // Helper function to convert inline markdown bold and italic to HTML
    const convertMarkdown = (text: string) => {
      // Handle bold first (** or __) 
      let result = text.replace(/\*\*(.+?)\*\*/g, '<strong class="text-white">$1</strong>');
      // Handle italic (* or _) - must come after bold to avoid breaking bold syntax
      result = result.replace(/\*(.+?)\*/g, '<em class="text-gray-300">$1</em>');
      return result;
    };
    
    const lines = post.content.split('\n');
    let inTable = false;
    let isFirstRow = true;
    let inCodeBlock = false;
    
    return lines.map((line, index) => {
      // Handle code blocks first - they take priority over everything else
      if (line.startsWith('```')) {
        inCodeBlock = !inCodeBlock;
        if (inCodeBlock) {
          const language = line.substring(3).trim() || 'plaintext';
          return `<pre class="my-4 rounded overflow-x-auto"><code class="language-${language}">`;
        }
        return '</code></pre>';
      }
      
      // If we're inside a code block, return the line as-is (escaped)
      if (inCodeBlock) {
        return line
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;') + '\n';
      }
      
      // Handle tables
      if (line.trim().startsWith('|')) {
        const cells = line.split('|').filter(cell => cell.trim() !== '');
        
        // Skip separator rows (|---|---|)
        if (line.includes('---')) {
          return '';
        }
        
        if (!inTable) {
          inTable = true;
          isFirstRow = true;
          const headerCells = cells.map(cell => `<th class="border border-purple-900/30 px-4 py-2 text-left text-white">${convertMarkdown(cell.trim())}</th>`).join('');
          return `<table class="w-full my-6 border-collapse border border-purple-900/30"><thead><tr>${headerCells}</tr></thead><tbody>`;
        } else if (isFirstRow) {
          isFirstRow = false;
          return '';
        } else {
          const bodyCells = cells.map(cell => `<td class="border border-purple-900/30 px-4 py-2">${convertMarkdown(cell.trim())}</td>`).join('');
          
          // Check if next line is still part of table
          const nextLine = lines[index + 1];
          if (!nextLine || !nextLine.trim().startsWith('|')) {
            inTable = false;
            return `<tr>${bodyCells}</tr></tbody></table>`;
          }
          return `<tr>${bodyCells}</tr>`;
        }
      }
      
      // Reset table state if we're not in a table line
      if (inTable && !line.trim().startsWith('|')) {
        inTable = false;
      }
      
      // Handle horizontal rules
      if (line.trim() === '---') {
        return `<hr class="my-8 border-t border-purple-900/30" />`;
      }
      
      if (line.startsWith('# ')) {
        return `<h1 class="text-4xl font-light text-white mt-12 mb-6">${convertMarkdown(line.substring(2))}</h1>`;
      } else if (line.startsWith('## ')) {
        return `<h2 class="text-3xl font-light text-white mt-10 mb-4">${convertMarkdown(line.substring(3))}</h2>`;
      } else if (line.startsWith('### ')) {
        return `<h3 class="text-2xl font-light text-white mt-8 mb-3">${convertMarkdown(line.substring(4))}</h3>`;
      } else if (line.startsWith('- **')) {
        const match = line.match(/- \*\*(.+?)\*\*: (.+)/);
        if (match) {
          return `<li class="ml-4"><strong class="text-white">${match[1]}</strong>: ${convertMarkdown(match[2])}</li>`;
        }
        return `<li class="ml-4">${convertMarkdown(line.substring(2))}</li>`;
      } else if (line.startsWith('✅ **')) {
        return `<p class="text-green-400">${convertMarkdown(line.replace('✅ ', ''))}</p>`;
      } else if (line.startsWith('❌ **')) {
        return `<p class="text-red-400">${convertMarkdown(line.replace('❌ ', ''))}</p>`;
      } else if (line.trim() === '') {
        return '';
      }
      return `<p>${convertMarkdown(line)}</p>`;
    }).join('');
  }, [post]);

  useEffect(() => {
    hljs.highlightAll();
  }, [htmlContent]);

  if (!post) {
    return (
      <div className="min-h-screen bg-black flex flex-col">
        <Navbar />
        <main className="flex-1 container mx-auto px-4 py-20 max-w-4xl">
          <div className="text-center">
            <h1 className="text-4xl font-light text-white mb-4">Post Not Found</h1>
            <Link href="/blog" className="text-purple-400 hover:text-purple-300">
              ← Back to Blog
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-20 max-w-4xl">
        <Link href="/blog" className="text-purple-400 hover:text-purple-300 mb-8 inline-block">
          ← Back to Blog
        </Link>
        
        <article className="prose prose-invert prose-purple max-w-none">
          <div className="mb-8">
            <span className="text-xs text-purple-400 uppercase tracking-wider">{post.category}</span>
            <h1 className="text-5xl font-light text-white mt-4 mb-4">{post.title}</h1>
            <div className="flex items-center gap-4 text-sm text-gray-400">
              <span>{post.author}</span>
              <span>•</span>
              <span>{post.date}</span>
              <span>•</span>
              <span>{post.readTime}</span>
            </div>
          </div>

          <div className="h-px w-full bg-gradient-to-r from-transparent via-purple-400/30 to-transparent mb-12"></div>

          <div 
            className="text-gray-300 leading-relaxed space-y-6"
            dangerouslySetInnerHTML={{ __html: htmlContent }}
          />
        </article>
      </main>
      <Footer />
    </div>
  );
}
