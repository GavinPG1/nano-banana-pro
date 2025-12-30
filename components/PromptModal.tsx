"use client";

import { useState, useEffect } from "react";
import { X, Copy, Check } from "lucide-react";
import Image from "next/image";
import { Prompt } from "../data/prompts";

interface PromptModalProps {
  prompt: Prompt | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function PromptModal({ prompt, isOpen, onClose }: PromptModalProps) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  // Prevent scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen || !prompt) return null;

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const promptBlocks = prompt.promptBlocks || [
    { label: "提示词 1", content: prompt.prompt }
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity" 
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-[#0f172a] rounded-2xl shadow-2xl border border-slate-800 flex flex-col animate-in fade-in zoom-in duration-200">
        
        {/* Header - Fixed */}
        <div className="p-6 pb-2 relative border-b border-slate-800/50">
          <button
            type="button"
            className="absolute right-4 top-4 z-10 rounded-full bg-slate-800/50 p-2 text-slate-400 hover:text-white hover:bg-slate-700 transition-all"
            onClick={onClose}
          >
            <X className="h-6 w-6" />
          </button>

          <div className="space-y-3">
            <h2 className="text-2xl font-bold text-white pr-12">
              案例 {prompt.id}: {prompt.title}
            </h2>
            
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-slate-400">
              {prompt.source && (
                <div className="flex items-center gap-1">
                  <span>来源:</span>
                  <span className="text-sky-400 font-medium hover:underline cursor-pointer">
                    {prompt.source.startsWith('@') ? prompt.source : `@${prompt.source}`}
                  </span>
                </div>
              )}
              {prompt.model && (
                <div className="flex items-center gap-1">
                  <span>模型:</span>
                  <span className="text-slate-300">{prompt.model}</span>
                </div>
              )}
            </div>

            <div className="flex flex-wrap gap-2 pt-1">
              {prompt.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 text-xs font-medium bg-[#1e293b] text-sky-300 rounded-full border border-sky-900/30"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Body - Scrollable */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-8">
          
          {/* Example Images Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              示例图片
            </h3>
            <div className="space-y-4">
              {(prompt.images || [prompt.imageUrl]).map((img, idx) => (
                <div key={idx} className="relative w-full rounded-xl overflow-hidden bg-slate-800 border border-slate-700 shadow-lg">
                  <Image
                    src={img}
                    alt={`${prompt.title} - ${idx + 1}`}
                    width={1200}
                    height={800}
                    className="w-full h-auto object-contain"
                    unoptimized={img.startsWith('http')}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Prompts Section */}
          <div className="space-y-4 pb-4">
            <h3 className="text-lg font-bold text-white">
              提示词
            </h3>
            <div className="space-y-4">
              {promptBlocks.map((block, idx) => (
                <div 
                  key={idx} 
                  className="group relative bg-[#1e293b]/50 rounded-xl border border-slate-800 p-5 hover:border-slate-700 transition-colors"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      {block.label}
                    </span>
                    <button
                      onClick={() => handleCopy(block.content, idx)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0f172a] text-slate-300 text-xs font-medium hover:text-white hover:bg-slate-700 border border-slate-800 transition-all"
                    >
                      {copiedIndex === idx ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-green-400" />
                          <span className="text-green-400">已复制</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>复制</span>
                        </>
                      )}
                    </button>
                  </div>
                  <pre className="text-slate-200 text-sm leading-relaxed whitespace-pre-wrap font-sans break-words">
                    {block.content}
                  </pre>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #0f172a;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #334155;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #475569;
        }
      `}</style>
    </div>
  );
}
