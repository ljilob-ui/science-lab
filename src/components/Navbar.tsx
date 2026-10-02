import React from 'react';
import { LabTab } from '../types';
import { ThemeToggle } from './ThemeToggle';
import { FlaskConical, Waves, Zap, Sparkles, Trophy, MessageSquareText } from 'lucide-react';

interface NavbarProps {
  currentTab: LabTab;
  onTabChange: (tab: LabTab) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, onTabChange }) => {
  const tabs = [
    { id: 'acid-base' as LabTab, label: '산·염기 중화반응', icon: FlaskConical, color: 'bg-neo-pink' },
    { id: 'density' as LabTab, label: '밀도와 부력 챔버', icon: Waves, color: 'bg-neo-cyan' },
    { id: 'circuit' as LabTab, label: '옴의 법칙 전기회로', icon: Zap, color: 'bg-neo-yellow' },
    { id: 'optics' as LabTab, label: '빛의 반사와 굴절', icon: Sparkles, color: 'bg-neo-lime' },
    { id: 'quiz' as LabTab, label: '탐구 퀴즈 랭킹', icon: Trophy, color: 'bg-neo-purple' },
    { id: 'community' as LabTab, label: '실험 나눔 게시판', icon: MessageSquareText, color: 'bg-neo-orange' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b-4 border-black dark:border-white shadow-[0_4px_0_0_#000000] dark:shadow-[0_4px_0_0_#FFFFFF]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Title */}
          <div 
            onClick={() => onTabChange('acid-base')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-12 h-12 rounded-xl bg-neo-yellow border-3 border-black shadow-[3px_3px_0px_#000] flex items-center justify-center transform group-hover:rotate-6 transition-transform">
              <FlaskConical className="w-7 h-7 text-black stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-black tracking-tight text-black dark:text-white">
                  과학실험실
                </span>
                <span className="px-2 py-0.5 text-xs font-black uppercase bg-neo-green text-black border-2 border-black rounded-md shadow-[2px_2px_0px_#000]">
                  중등 탐구
                </span>
              </div>
              <p className="text-xs font-semibold text-gray-600 dark:text-gray-300">
                인터랙티브 가상 시뮬레이션 & 교구 플랫폼
              </p>
            </div>
          </div>

          {/* Navigation Tabs (Desktop) */}
          <nav className="hidden lg:flex items-center gap-2">
            {tabs.map((t) => {
              const Icon = t.icon;
              const isActive = currentTab === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => onTabChange(t.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-bold text-sm border-2 border-black dark:border-white transition-all ${
                    isActive
                      ? `${t.color} text-black shadow-[3px_3px_0px_#000] dark:shadow-[3px_3px_0px_#fff] translate-x-[-1px] translate-y-[-1px]`
                      : 'bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-700'
                  }`}
                >
                  <Icon className="w-4 h-4 stroke-[2.5]" />
                  <span>{t.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right controls */}
          <div className="flex items-center gap-3">
            <ThemeToggle />
          </div>
        </div>

        {/* Navigation Tabs (Mobile & Tablet scrollable) */}
        <div className="flex lg:hidden overflow-x-auto pb-3 gap-2 no-scrollbar">
          {tabs.map((t) => {
            const Icon = t.icon;
            const isActive = currentTab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => onTabChange(t.id)}
                className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold text-xs border-2 border-black dark:border-white ${
                  isActive
                    ? `${t.color} text-black shadow-[2px_2px_0px_#000] dark:shadow-[2px_2px_0px_#fff]`
                    : 'bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>

      </div>
    </header>
  );
};
