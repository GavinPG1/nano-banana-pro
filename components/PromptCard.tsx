"use client";

import Image from "next/image";
import { Prompt } from "../data/prompts";
import { Copy, Check } from "lucide-react";
import { useState } from "react";

interface PromptCardProps {
  prompt: Prompt;
  onClick: (prompt: Prompt) => void;
}

export default function PromptCard({ prompt, onClick }: PromptCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(prompt.prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div 
      onClick={() => onClick(prompt)}
      className="group relative bg-[#0f172a] rounded-xl overflow-hidden hover:shadow-[0_0_20px_rgba(0,0,0,0.5)] transition-all duration-300 border border-slate-800 cursor-pointer"
    >
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden bg-slate-800">
        <Image
          src={prompt.imageUrl}
          alt={prompt.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          unoptimized={prompt.imageUrl.startsWith('http')}
        />
        
        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
          <div className="flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
            {/* Copy Button */}
            <button
              onClick={handleCopy}
              className="p-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl hover:bg-white/20 text-white transition-all"
              title="复制提示词"
            >
              {copied ? <Check className="w-5 h-5 text-green-400" /> : <Copy className="w-5 h-5" />}
            </button>
            
            {/* Details Button */}
            <div className="px-5 py-2.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl hover:bg-white/20 text-white font-medium text-sm transition-all">
              查看详情
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        <h3 className="font-bold text-slate-100 line-clamp-1 group-hover:text-sky-400 transition-colors" title={prompt.title}>
          案例 {prompt.id}: {prompt.title}
        </h3>
        
        <div className="flex flex-wrap gap-1.5">
          {prompt.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 text-[10px] font-medium bg-slate-800 text-slate-400 rounded-md border border-slate-700 uppercase tracking-wider"
            >
              {tag}
            </span>
          ))}
          {prompt.tags.length > 3 && (
            <span className="text-[10px] text-slate-500 font-medium flex items-center">
              +{prompt.tags.length - 3}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
