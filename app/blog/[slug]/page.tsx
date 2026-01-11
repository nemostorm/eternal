'use client';

import { useParams } from 'next/navigation';
import { Navbar } from "../../components/Navbar";
import { Footer } from "../../components/Footer";
import Link from 'next/link';
import { blogPosts, BlogPost } from '@/lib/posts';

export default function BlogPostPage() {
  const params = useParams();
  const slug = params.slug as string;
  
  const post = blogPosts.find(p => p.slug === slug);

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
            dangerouslySetInnerHTML={{ __html: (() => {
              // Helper function to convert inline markdown bold to HTML
              const convertBold = (text: string) => text.replace(/\*\*(.+?)\*\*/g, '<strong class="text-white">$1</strong>');
              
              const lines = post.content.split('\n');
              
              return lines.map((line, index) => {
                let inTable = false;
                let isFirstRow = true;
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
                    const headerCells = cells.map(cell => `<th class="border border-purple-900/30 px-4 py-2 text-left text-white">${convertBold(cell.trim())}</th>`).join('');
                    return `<table class="w-full my-6 border-collapse border border-purple-900/30"><thead><tr>${headerCells}</tr></thead><tbody>`;
                  } else if (isFirstRow) {
                    isFirstRow = false;
                    return '';
                  } else {
                    const bodyCells = cells.map(cell => `<td class="border border-purple-900/30 px-4 py-2">${convertBold(cell.trim())}</td>`).join('');
                    
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
                  return `<h1 class="text-4xl font-light text-white mt-12 mb-6">${convertBold(line.substring(2))}</h1>`;
                } else if (line.startsWith('## ')) {
                  return `<h2 class="text-3xl font-light text-white mt-10 mb-4">${convertBold(line.substring(3))}</h2>`;
                } else if (line.startsWith('### ')) {
                  return `<h3 class="text-2xl font-light text-white mt-8 mb-3">${convertBold(line.substring(4))}</h3>`;
                } else if (line.startsWith('```')) {
                  const isClosing = line === '```';
                  return isClosing 
                    ? '</code></pre>' 
                    : `<pre class="bg-neutral-900/30 p-4 rounded overflow-x-auto my-4"><code class="text-sm text-stone-200">`;
                } else if (line.startsWith('- **')) {
                  const match = line.match(/- \*\*(.+?)\*\*: (.+)/);
                  if (match) {
                    return `<li class="ml-4"><strong class="text-white">${match[1]}</strong>: ${convertBold(match[2])}</li>`;
                  }
                  return `<li class="ml-4">${convertBold(line.substring(2))}</li>`;
                } else if (line.startsWith('✅ **')) {
                  return `<p class="text-green-400">${convertBold(line.replace('✅ ', ''))}</p>`;
                } else if (line.startsWith('❌ **')) {
                  return `<p class="text-red-400">${convertBold(line.replace('❌ ', ''))}</p>`;
                } else if (line.trim() === '') {
                  return '<br/>';
                }
                return `<p>${convertBold(line)}</p>`;
              }).join('');
            })()
            }}
          />
        </article>
      </main>
      <Footer />
    </div>
  );
}
