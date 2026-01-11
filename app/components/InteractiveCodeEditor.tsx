'use client';

import { useState } from 'react';
import hljs from 'highlight.js/lib/core';
import csharp from 'highlight.js/lib/languages/csharp';
import { Copy } from 'lucide-react';

// Register C# language
hljs.registerLanguage('csharp', csharp);

interface CodeTab {
  id: string;
  title: string;
  code: string;
  language?: string;
}

interface InteractiveCodeEditorProps {
  tabs: CodeTab[];
  defaultTab?: string;
}

export function InteractiveCodeEditor({ tabs, defaultTab }: InteractiveCodeEditorProps) {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id || '');
  const [copied, setCopied] = useState(false);

  const activeTabData = tabs.find(tab => tab.id === activeTab);

  const copyToClipboard = async () => {
    if (activeTabData) {
      await navigator.clipboard.writeText(activeTabData.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="bg-neutral-950 rounded-lg border border-purple-900/30 overflow-hidden my-6">
      {/* Tab Headers */}
      <div className="flex border-b border-purple-900/30 bg-neutral-800/10">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 text-sm font-medium transition-colors duration-200 ${
              activeTab === tab.id
                ? 'bg-purple-900/20 text-purple-300 border-b-2 border-purple-500'
                : 'text-gray-400 hover:text-gray-300 hover:bg-neutral-800/30'
            }`}
          >
            {tab.title}
          </button>
        ))}
      </div>

      {/* Code Display Area */}
      <div className="relative">
        {/* Toolbar */}
        <div className="flex items-center justify-between px-4 py-2 bg-neutral-900/30 border-b border-gray-700/50">
          <div className="flex items-center space-x-2">
            <span className="text-xs text-gray-400">
              {activeTabData?.language || 'csharp'} • Strategy Pattern Example
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={copyToClipboard}
              className="flex items-center space-x-1 px-3 py-1 text-xs bg-neutral-900/90 hover:bg-neutral-950 text-white rounded transition-colors duration-200"
            >
              <Copy size={12} />
              <span>{copied ? 'Copied!' : 'Copy'}</span>
            </button>
          </div>
        </div>

        {/* Code Content */}
        <div className="p-4 overflow-x-auto">
          <pre className="text-sm">
            <code
              className="language-csharp hljs"
              dangerouslySetInnerHTML={{
                __html: activeTabData ? hljs.highlight(activeTabData.code, { language: activeTabData.language || 'csharp' }).value : ''
              }}
            />
          </pre>
        </div>
      </div>
    </div>
  );
}