import React, { useState, useEffect } from 'react';
import { Post } from '../types';
import { fetchPosts, createPost, likePost } from '../lib/supabase';
import { MessageSquareText, Heart, Plus, Search, Tag, User, Calendar, X, Send } from 'lucide-react';

export const CommunityReports: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('전체');
  const [searchKeyword, setSearchKeyword] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // New post form state
  const [newTitle, setNewTitle] = useState<string>('');
  const [newAuthor, setNewAuthor] = useState<string>('');
  const [newCategory, setNewCategory] = useState<string>('화학');
  const [newContent, setNewContent] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const categories = ['전체', '화학', '물리', '생물', '지구과학', '수업자료'];

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    setIsLoading(true);
    const data = await fetchPosts();
    setPosts(data);
    setIsLoading(false);
  };

  const handleLike = async (id: string) => {
    const updatedLikes = await likePost(id);
    setPosts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, likes: updatedLikes } : p))
    );
  };

  const handleSubmitPost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newAuthor.trim() || !newContent.trim()) return;

    setIsSubmitting(true);
    await createPost({
      title: newTitle.trim(),
      author: newAuthor.trim(),
      category: newCategory,
      content: newContent.trim(),
    });

    // Reset and reload
    setNewTitle('');
    setNewAuthor('');
    setNewContent('');
    setIsSubmitting(false);
    setIsModalOpen(false);
    await loadPosts();
  };

  const filteredPosts = posts.filter((p) => {
    const matchCategory = selectedCategory === '전체' || p.category === selectedCategory;
    const matchSearch =
      p.title.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      p.content.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      p.author.toLowerCase().includes(searchKeyword.toLowerCase());
    return matchCategory && matchSearch;
  });

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-neo-orange p-5 rounded-2xl neo-border shadow-brutal flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-white">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 bg-black text-white text-xs font-black rounded uppercase">
              교사 커뮤니티
            </span>
            <h2 className="text-2xl font-black text-white">탐구 보고서 & 수업 지도안 나눔 게시판</h2>
          </div>
          <p className="text-sm font-semibold text-white/90 mt-1">
            전국 중학교 과학교사들이 실제 수업에서 활용한 실험 관찰지, 교수학습 팁, 학생 피드백을 공유하는 공간입니다.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="neo-btn px-4 py-2.5 bg-neo-yellow text-black rounded-xl text-sm font-black flex items-center gap-2"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>새 탐구 보고서 등록</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl neo-border shadow-brutal flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Category Pills */}
        <div className="flex flex-wrap gap-1.5 w-full sm:w-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-black border-2 border-black transition-all ${
                selectedCategory === cat
                  ? 'bg-neo-pink text-white shadow-[2px_2px_0px_#000] -translate-y-0.5'
                  : 'bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="제목, 내용, 작성자 검색..."
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-xl border-2 border-black text-xs font-bold bg-gray-50 dark:bg-slate-700 text-black dark:text-white"
          />
        </div>
      </div>

      {/* Posts List */}
      <div className="space-y-4">
        {filteredPosts.length === 0 ? (
          <div className="bg-white dark:bg-slate-800 p-12 rounded-2xl neo-border shadow-brutal text-center space-y-3">
            <MessageSquareText className="w-12 h-12 text-gray-400 mx-auto" />
            <p className="font-black text-gray-600 dark:text-gray-300">
              일치하는 게시물이 없습니다. 첫 번째 실험 보고서를 등록해 보세요!
            </p>
          </div>
        ) : (
          filteredPosts.map((post) => (
            <div
              key={post.id}
              className="bg-white dark:bg-slate-800 p-5 rounded-2xl neo-border shadow-brutal space-y-3 transition-all hover:translate-x-[-1px] hover:translate-y-[-1px]"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 text-xs font-black rounded-md bg-neo-cyan text-black border border-black shadow-[1px_1px_0px_#000]">
                    {post.category || '과학'}
                  </span>
                  <h3 className="text-base sm:text-lg font-black text-black dark:text-white">
                    {post.title}
                  </h3>
                </div>

                <div className="flex items-center gap-3 text-xs font-bold text-gray-500">
                  <span className="flex items-center gap-1">
                    <User className="w-3.5 h-3.5" />
                    {post.author}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {new Date(post.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                {post.content}
              </p>

              <div className="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-slate-700">
                <span className="text-[11px] font-semibold text-gray-400">
                  * Supabase `posts` 테이블 연동 데이터
                </span>

                <button
                  onClick={() => handleLike(post.id)}
                  className="neo-btn px-3 py-1 rounded-lg text-xs font-black bg-white dark:bg-slate-700 text-black dark:text-white flex items-center gap-1.5 hover:bg-pink-50"
                >
                  <Heart className="w-3.5 h-3.5 text-pink-500 fill-pink-500" />
                  <span>추천 {post.likes}</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* New Post Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 w-full max-w-lg p-6 rounded-2xl neo-border shadow-brutal-xl space-y-4 relative">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-black text-black dark:text-white flex items-center gap-2">
                <Plus className="w-5 h-5 text-neo-pink" />
                새 탐구 보고서 작성
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg border-2 border-black hover:bg-gray-100 dark:hover:bg-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmitPost} className="space-y-4">
              <div>
                <label className="text-xs font-black text-gray-700 dark:text-gray-300 block mb-1">
                  제목
                </label>
                <input
                  type="text"
                  placeholder="예: [중2 물리] 옴의 법칙 직렬·병렬 합성저항 측정 활동지"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-xl border-2 border-black font-bold text-sm bg-gray-50 dark:bg-slate-700 text-black dark:text-white shadow-[2px_2px_0px_#000]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-black text-gray-700 dark:text-gray-300 block mb-1">
                    작성자 (교사명/연구자)
                  </label>
                  <input
                    type="text"
                    placeholder="예: 홍길동 교사"
                    value={newAuthor}
                    onChange={(e) => setNewAuthor(e.target.value)}
                    required
                    className="w-full px-3 py-2 rounded-xl border-2 border-black font-bold text-sm bg-gray-50 dark:bg-slate-700 text-black dark:text-white shadow-[2px_2px_0px_#000]"
                  />
                </div>

                <div>
                  <label className="text-xs font-black text-gray-700 dark:text-gray-300 block mb-1">
                    과목 분류
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border-2 border-black font-bold text-sm bg-gray-50 dark:bg-slate-700 text-black dark:text-white shadow-[2px_2px_0px_#000]"
                  >
                    <option value="화학">화학</option>
                    <option value="물리">물리</option>
                    <option value="생물">생물</option>
                    <option value="지구과학">지구과학</option>
                    <option value="수업자료">수업자료</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-black text-gray-700 dark:text-gray-300 block mb-1">
                  탐구 내용 및 지도안
                </label>
                <textarea
                  rows={5}
                  placeholder="실험 진행 절차, 학생 질문 유도 팁, 탐구 결과 등을 자유롭게 공유해 주세요."
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-xl border-2 border-black font-bold text-sm bg-gray-50 dark:bg-slate-700 text-black dark:text-white shadow-[2px_2px_0px_#000]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="neo-btn px-4 py-2 bg-gray-200 dark:bg-slate-700 text-black dark:text-white rounded-xl text-xs font-black"
                >
                  취소
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="neo-btn px-5 py-2 bg-neo-green text-black rounded-xl text-xs font-black flex items-center gap-1.5 disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isSubmitting ? '저장 중...' : '게시물 등록'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
