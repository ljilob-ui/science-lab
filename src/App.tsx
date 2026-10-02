import React, { useState } from 'react';
import { LabTab } from './types';
import { Navbar } from './components/Navbar';
import { AcidBaseLab } from './components/AcidBaseLab';
import { DensityBuoyancyLab } from './components/DensityBuoyancyLab';
import { CircuitOhmLab } from './components/CircuitOhmLab';
import { LightOpticsLab } from './components/LightOpticsLab';
import { QuizRankings } from './components/QuizRankings';
import { CommunityReports } from './components/CommunityReports';
import { isSupabaseConfigured } from './lib/supabase';
import { FlaskConical, Database, CloudCheck, Sparkles, Compass, ShieldCheck } from 'lucide-react';

export const App: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<LabTab>('acid-base');

  return (
    <div className="min-h-screen aurora-mesh flex flex-col justify-between selection:bg-neo-yellow selection:text-black">
      
      {/* Sticky Navbar */}
      <Navbar currentTab={currentTab} onTabChange={setCurrentTab} />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-8">
        
        {/* Hero Aurora Banner */}
        <div className="relative overflow-hidden rounded-3xl neo-border shadow-brutal-lg bg-gradient-to-r from-pink-500/15 via-cyan-500/15 to-yellow-500/15 backdrop-blur-xl p-6 sm:p-8">
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-neo-yellow text-black border-2 border-black rounded-lg text-xs font-black shadow-[2px_2px_0px_#000]">
                <Sparkles className="w-3.5 h-3.5" />
                <span>2022 개정 교육과정 반영 · 교사용 차세대 디지털 교구</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-black dark:text-white tracking-tight">
                중학교 과학실험실 (Science Virtual Lab)
              </h1>
              <p className="text-sm sm:text-base font-bold text-gray-700 dark:text-gray-300">
                물리, 화학의 핵심 실험을 직관적인 조작과 실시간 물리엔진 수치로 시뮬레이션하고, 탐구 퀴즈와 지도안을 공유합니다.
              </p>
            </div>

            {/* Quick Status Badges */}
            <div className="flex flex-col sm:flex-row md:flex-col gap-2.5 w-full md:w-auto">
              <div className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-slate-800 rounded-xl border-2 border-black dark:border-white text-xs font-black shadow-[2px_2px_0px_#000]">
                <ShieldCheck className="w-4 h-4 text-green-500" />
                <span>네오 브루탈리즘 + 오로라 메쉬 UI</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-slate-800 rounded-xl border-2 border-black dark:border-white text-xs font-black shadow-[2px_2px_0px_#000]">
                <Database className="w-4 h-4 text-neo-purple" />
                <span>
                  Supabase DB: {isSupabaseConfigured ? '🟢 실시간 연동됨' : '🟡 로컬 상태 활성'}
                </span>
              </div>
            </div>
          </div>

          {/* Background Decorative Glow */}
          <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-neo-cyan/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -left-20 -top-20 w-80 h-80 bg-neo-pink/20 rounded-full blur-3xl pointer-events-none" />
        </div>

        {/* Tab Content Display */}
        <div className="transition-all duration-200">
          {currentTab === 'acid-base' && <AcidBaseLab />}
          {currentTab === 'density' && <DensityBuoyancyLab />}
          {currentTab === 'circuit' && <CircuitOhmLab />}
          {currentTab === 'optics' && <LightOpticsLab />}
          {currentTab === 'quiz' && <QuizRankings />}
          {currentTab === 'community' && <CommunityReports />}
        </div>

      </main>

      {/* Footer */}
      <footer className="mt-12 bg-white dark:bg-slate-900 border-t-4 border-black dark:border-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-neo-yellow border-2 border-black flex items-center justify-center font-black shadow-[2px_2px_0px_#000]">
              🧪
            </div>
            <div>
              <span className="font-black text-sm text-black dark:text-white">
                과학실험실 · Interactive Science Education Lab
              </span>
              <p className="text-xs text-gray-500">
                Vercel Serverless Edge Optimized · Supabase PostgreSQL Storage Powered
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs font-black text-gray-600 dark:text-gray-400">
            <span>© 2026 과학실험실. All rights reserved.</span>
            <span className="px-2 py-0.5 bg-gray-100 dark:bg-slate-800 rounded border border-black text-[11px]">
              v1.0.0 Production Ready
            </span>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default App;
