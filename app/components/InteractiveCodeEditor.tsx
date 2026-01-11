'use client';

import { useState } from 'react';
import hljs from 'highlight.js/lib/core';
import csharp from 'highlight.js/lib/languages/csharp';
import { Copy, Play } from 'lucide-react';

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

  const runCode = () => {
    // For now, just show an alert - in a real implementation, this could integrate with a code execution service
    alert('Code execution would run here in a full IDE environment!');
  };

  return (
    <div className="bg-gray-900 rounded-lg border border-purple-900/30 overflow-hidden my-6">
      {/* Tab Headers */}
      <div className="flex border-b border-purple-900/30 bg-gray-800/50">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 text-sm font-medium transition-colors duration-200 ${
              activeTab === tab.id
                ? 'bg-purple-900/20 text-purple-300 border-b-2 border-purple-500'
                : 'text-gray-400 hover:text-gray-300 hover:bg-gray-800/30'
            }`}
          >
            {tab.title}
          </button>
        ))}
      </div>

      {/* Code Display Area */}
      <div className="relative">
        {/* Toolbar */}
        <div className="flex items-center justify-between px-4 py-2 bg-gray-800/30 border-b border-gray-700/50">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="text-xs text-gray-400 ml-4">
              {activeTabData?.language || 'csharp'} • Strategy Pattern Example
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={runCode}
              className="flex items-center space-x-1 px-3 py-1 text-xs bg-green-600 hover:bg-green-700 text-white rounded transition-colors duration-200"
            >
              <Play size={12} />
              <span>Run</span>
            </button>
            <button
              onClick={copyToClipboard}
              className="flex items-center space-x-1 px-3 py-1 text-xs bg-gray-600 hover:bg-gray-700 text-white rounded transition-colors duration-200"
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