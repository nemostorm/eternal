'use client';

import Link from 'next/link';

export default function Svg() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center overflow-hidden relative">
      <svg
        className="absolute inset-0 w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1000 1000"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#1e1b4b', stopOpacity: 0.15 }} />
            <stop offset="100%" style={{ stopColor: '#581c87', stopOpacity: 0.05 }} />
          </linearGradient>

          <linearGradient id="grad2" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#7c3aed', stopOpacity: 0.08 }} />
            <stop offset="100%" style={{ stopColor: '#000000', stopOpacity: 0.02 }} />
          </linearGradient>

          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        <circle cx="150" cy="150" r="100" fill="url(#grad1)" opacity="0.2">
          <animate
            attributeName="cy"
            values="150;200;150"
            dur="8s"
            repeatCount="indefinite"
          />
        </circle>

        <circle cx="850" cy="850" r="120" fill="url(#grad2)" opacity="0.15">
          <animate
            attributeName="cx"
            values="850;800;850"
            dur="10s"
            repeatCount="indefinite"
          />
        </circle>

        <path
          d="M 200 500 Q 500 300, 800 500"
          stroke="rgba(139, 92, 246, 0.08)"
          strokeWidth="2"
          fill="none"
          filter="url(#glow)"
        >
          <animate
            attributeName="d"
            values="M 200 500 Q 500 300, 800 500;M 200 500 Q 500 400, 800 500;M 200 500 Q 500 300, 800 500"
            dur="6s"
            repeatCount="indefinite"
          />
        </path>

        <circle cx="500" cy="200" r="3" fill="#a78bfa" opacity="0.3">
          <animate
            attributeName="opacity"
            values="0.3;0.6;0.3"
            dur="3s"
            repeatCount="indefinite"
          />
        </circle>

        <circle cx="700" cy="300" r="2" fill="#c4b5fd" opacity="0.25">
          <animate
            attributeName="opacity"
            values="0.25;0.5;0.25"
            dur="4s"
            repeatCount="indefinite"
          />
        </circle>

        <circle cx="300" cy="700" r="2.5" fill="#ddd6fe" opacity="0.2">
          <animate
            attributeName="opacity"
            values="0.2;0.4;0.2"
            dur="5s"
            repeatCount="indefinite"
          />
        </circle>
      </svg>

      <div className="relative z-10 text-center px-4">
        <h1 className="text-6xl md:text-8xl font-light text-white mb-4 tracking-tight">
          Eternal
        </h1>
        <div className="h-px w-32 mx-auto bg-gradient-to-r from-transparent via-purple-400/30 to-transparent mb-8"></div>
        <Link href="/blog">
          <button className="text-lg md:text-xl text-purple-200/90 font-light tracking-wider hover:text-white transition-colors duration-300 border border-purple-400/30 px-8 py-3 rounded-sm hover:border-purple-400/60">
            Enter
          </button>
        </Link>
      </div>
    </div>  
  );
}