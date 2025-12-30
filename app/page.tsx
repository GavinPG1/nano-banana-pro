"use client";

import { useState, useMemo } from "react";
import { prompts, allTags, Prompt } from "../data/prompts";
import PromptCard from "../components/PromptCard";
import PromptModal from "../components/PromptModal";
import { Search, X, Banana } from "lucide-react";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedPrompt, setSelectedPrompt] = useState<Prompt | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = (prompt: Prompt) => {
    setSelectedPrompt(prompt);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    // Optional: delay clearing selectedPrompt to avoid flicker during exit animation
    setTimeout(() => setSelectedPrompt(null), 300);
  };

  // Filter Logic
  const filteredPrompts = useMemo(() => {
    return prompts.filter((prompt) => {
      // Search Text Match
      const matchesSearch =
        prompt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prompt.prompt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prompt.id.includes(searchQuery);

      // Tags Match (AND logic: must contain ALL selected tags)
      // Or OR logic? Usually OR for tags, or AND. Let's do OR for now, or check if tag is in list.
      // If no tags selected, match all.
      // If tags selected, prompt must have AT LEAST ONE of the selected tags? 
      // User requirement usually implies "Show me '3d' AND 'character'". 
      // Let's stick to: if tags selected, prompt must have ALL selected tags (Intersection).
      // Actually, looking at the UI, usually clicking a tag toggles it. 
      // Let's assume OR logic for multiple tags for broader results, or AND for specific.
      // Let's go with: Show if it matches search AND (if tags selected, must match at least one).
      
      const matchesTags =
        selectedTags.length === 0 ||
        selectedTags.some((tag) => prompt.tags.includes(tag));

      return matchesSearch && matchesTags;
    });
  }, [searchQuery, selectedTags]);

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag)
        ? prev.filter((t) => t !== tag)
        : [...prev, tag]
    );
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedTags([]);
  };

  return (
    <main className="min-h-screen bg-slate-900 text-slate-100 p-6 md:p-12">
      {/* Header */}
      <div className="max-w-7xl mx-auto space-y-8">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-2">
            <h1 className="text-3xl md:text-4xl font-bold flex items-center gap-3">
              <Banana className="text-yellow-400 w-10 h-10" />
              OpenNana 提示词图库
            </h1>
            <p className="text-slate-400 text-lg">
              浏览、筛选和搜索提示词案例图库，快速复制提示词，探索灵感。
            </p>
          </div>
          
          {/* Promo Banner Placeholder */}
          <div className="hidden md:block bg-gradient-to-r from-blue-600 to-purple-600 p-4 rounded-lg shadow-lg max-w-sm">
            <p className="font-bold text-white">Nano-Banana-2.0 强势上线！</p>
            <p className="text-sm text-blue-100">立即体验 &gt;&gt;</p>
          </div>
        </header>

        {/* Search & Filters */}
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Bar */}
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                placeholder="搜索案例编号、标题或提示词..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg py-3 pl-12 pr-4 text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-slate-500 transition-all"
              />
            </div>
            
            {/* Clear Button */}
            {(searchQuery || selectedTags.length > 0) && (
              <button
                onClick={clearFilters}
                className="flex items-center justify-center px-6 py-3 bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 transition-colors"
              >
                <X className="w-4 h-4 mr-2" />
                清除筛选
              </button>
            )}
            
            <div className="flex items-center text-slate-400">
              共 {filteredPrompts.length} / {prompts.length} 个案例
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedTags.includes(tag)
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30"
                    : "bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-200"
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredPrompts.map((prompt) => (
            <PromptCard key={prompt.id} prompt={prompt} onClick={handleOpenModal} />
          ))}
        </div>

        {/* Modal */}
        <PromptModal 
          prompt={selectedPrompt} 
          isOpen={isModalOpen} 
          onClose={handleCloseModal} 
        />

        {/* Empty State */}
        {filteredPrompts.length === 0 && (
          <div className="text-center py-20 text-slate-500">
            <p className="text-xl">没有找到匹配的案例</p>
            <button 
              onClick={clearFilters}
              className="mt-4 text-blue-400 hover:text-blue-300 underline"
            >
              清除所有筛选条件
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
