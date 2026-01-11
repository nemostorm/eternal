'use client';

import { useParams } from 'next/navigation';
import { useMemo, useEffect } from 'react';
import hljs from 'highlight.js';
import 'highlight.js/styles/github-dark.css';
import { Navbar } from "../../components/Navbar";
import { Footer } from "../../components/Footer";
import { InteractiveCodeEditor } from "../../components/InteractiveCodeEditor";
import Link from 'next/link';
import { blogPosts, BlogPost } from '@/lib/posts';

export default function BlogPostPage() {
  const params = useParams();
  const slug = params.slug as string;
  
  const post = blogPosts.find(p => p.slug === slug);

  const renderContent = useMemo(() => {
    if (!post) return [];

    const contentParts = post.content.split('[INTERACTIVE_CODE_EDITOR]');
    const elements: JSX.Element[] = [];

    contentParts.forEach((part, index) => {
      // Add the text content (converted to HTML)
      if (part.trim()) {
        elements.push(
          <div
            key={`text-${index}`}
            className="prose prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: convertMarkdownToHtml(part) }}
          />
        );
      }

      // Add the interactive code editor between text parts
      if (index < contentParts.length - 1) {
        elements.push(
          <InteractiveCodeEditor
            key={`editor-${index}`}
            tabs={[
              {
                id: 'bad-approach',
                title: '❌ Bad Approach',
                code: `public class PaymentProcessor
{
    public void ProcessPayment(decimal amount, string method)
    {
        if (method == "credit-card")
        {
            // Credit card logic
            Console.WriteLine("Processing credit card payment...");
        }
        else if (method == "paypal")
        {
            // PayPal logic
            Console.WriteLine("Processing PayPal payment...");
        }
        else if (method == "crypto")
        {
            // Cryptocurrency logic
            Console.WriteLine("Processing crypto payment...");
        }
        else if (method == "bank-transfer")
        {
            // Bank transfer logic
            Console.WriteLine("Processing bank transfer...");
        }
    }
}`
              },
              {
                id: 'strategy-interface',
                title: '🔧 Strategy Interface',
                code: `// Strategy Interface
public interface IPaymentStrategy
{
    void Pay(decimal amount);
}`
              },
              {
                id: 'concrete-strategies',
                title: '💳 Concrete Strategies',
                code: `// Concrete Strategies
public class CreditCardPayment : IPaymentStrategy
{
    private readonly string _cardNumber;
    private readonly string _cvv;
    private readonly string _expiryDate;

    public CreditCardPayment(string cardNumber, string cvv, string expiryDate)
    {
        _cardNumber = cardNumber;
        _cvv = cvv;
        _expiryDate = expiryDate;
    }

    public void Pay(decimal amount)
    {
        Console.WriteLine($"Processing credit card payment of {amount}");
        Console.WriteLine($"Card: ****{_cardNumber.Substring(_cardNumber.Length - 4)}");
        // Actual credit card processing logic
    }
}

public class PayPalPayment : IPaymentStrategy
{
    private readonly string _email;

    public PayPalPayment(string email)
    {
        _email = email;
    }

    public void Pay(decimal amount)
    {
        Console.WriteLine($"Processing PayPal payment of {amount}");
        Console.WriteLine($"Account: {_email}");
        // Actual PayPal processing logic
    }
}`
              },
              {
                id: 'context-class',
                title: '🎯 Context Class',
                code: `// Context
public class PaymentProcessor
{
    private IPaymentStrategy _strategy;

    public PaymentProcessor(IPaymentStrategy strategy)
    {
        _strategy = strategy;
    }

    public void SetStrategy(IPaymentStrategy strategy)
    {
        _strategy = strategy;
    }

    public void ProcessPayment(decimal amount)
    {
        _strategy.Pay(amount);
    }
}`
              },
              {
                id: 'usage-example',
                title: '🚀 Usage Example',
                code: `// Client code
var processor = new PaymentProcessor(
    new CreditCardPayment("1234567890123456", "123", "12/28")
);

processor.ProcessPayment(100);
// Output: Processing credit card payment of $100
//         Card: ****3456

// Switch strategy at runtime
processor.SetStrategy(new PayPalPayment("user@example.com"));
processor.ProcessPayment(50);
// Output: Processing PayPal payment of $50
//         Account: user@example.com`
              }
            ]}
            defaultTab="bad-approach"
          />
        );
      }
    });

    return elements;
  }, [post]);

  // Helper function to convert markdown to HTML
  const convertMarkdownToHtml = (text: string): string => {
    // Handle headers
    let result = text.replace(/^### (.*$)/gm, '<h3 class="text-xl font-semibold text-white mt-8 mb-4">$1</h3>');
    result = result.replace(/^## (.*$)/gm, '<h2 class="text-2xl font-semibold text-white mt-8 mb-4">$1</h2>');
    result = result.replace(/^# (.*$)/gm, '<h1 class="text-3xl font-bold text-white mt-8 mb-4">$1</h1>');

    // Handle bold and italic
    result = result.replace(/\*\*(.+?)\*\*/g, '<strong class="text-white">$1</strong>');
    result = result.replace(/\*(.+?)\*/g, '<em class="text-gray-300">$1</em>');

    // Handle lists
    result = result.replace(/^- (.*$)/gm, '<li class="text-gray-300 ml-4">$1</li>');
    result = result.replace(/(<li.*<\/li>\n?)+/g, '<ul class="list-disc list-inside mb-4">$&</ul>');

    // Handle paragraphs
    result = result.replace(/\n\n/g, '</p><p class="text-gray-300 leading-relaxed mb-4">');
    result = '<p class="text-gray-300 leading-relaxed mb-4">' + result + '</p>';

    return result;
  };
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
      } else if (line.startsWith('- ')) {
        return `<li class="ml-4 list-disc">${convertMarkdown(line.substring(2))}</li>`;
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
  }, [renderContent]);

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
    <div className="min-h-screen bg-black flex flex-col relative overflow-hidden">
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
      <main className="flex-1 container mx-auto px-4 py-20 max-w-4xl relative z-1">
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

          <article className="text-gray-300 leading-relaxed space-y-6">
            {renderContent}
          </article>
        </article>
      </main>
      <Footer />
    </div>
  );
}
