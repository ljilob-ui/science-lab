import React, { useState, useEffect } from 'react';
import { QuizQuestion, Score } from '../types';
import { fetchScores, submitScore } from '../lib/supabase';
import { Trophy, CheckCircle, XCircle, ArrowRight, RotateCcw, Medal, Sparkles, Send } from 'lucide-react';
import confetti from 'canvas-confetti';

const QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    lab: '화학 · 산과 염기',
    question: '0.1M 염산(HCl) 20mL에 0.1M 수산화나트륨(NaOH) 20mL를 가하여 완전 중화되었을 때, 비커 속 혼합 용액에 가장 많이 존재하는 이온 2가지는 무엇일까요?',
    options: [
      '수소 이온(H⁺)과 수산화 이온(OH⁻)',
      '나트륨 이온(Na⁺)과 염화 이온(Cl⁻)',
      '수소 이온(H⁺)과 나트륨 이온(Na⁺)',
      '수산화 이온(OH⁻)과 염화 이온(Cl⁻)'
    ],
    correctIndex: 1,
    explanation: '완전 중화점에서는 H⁺와 OH⁻가 반응하여 물(H₂O)이 되므로 거의 존재하지 않고, 구경꾼 이온인 Na⁺와 Cl⁻가 용액 속에 가장 많이 존재합니다.'
  },
  {
    id: 2,
    lab: '물리 · 물질의 특성',
    question: '물(밀도 1.0 g/cm³)과 식용유(밀도 0.92 g/cm³)를 실린더에 넣었을 때 층이 분리되었습니다. 밀도가 0.95 g/cm³인 플라스틱 조각을 넣으면 어디에 위치할까요?',
    options: [
      '식용유의 맨 위에 뜬다.',
      '식용유와 물의 경계면 사이에 위치한다.',
      '물의 맨 바닥으로 가라앉는다.',
      '완전히 녹아 사라진다.'
    ],
    correctIndex: 1,
    explanation: '물체의 밀도(0.95)가 식용유(0.92)보다는 크고 물(1.0)보다는 작으므로, 식용유는 통과하고 물 위에는 뜨는 두 액체의 경계면에 위치하게 됩니다.'
  },
  {
    id: 3,
    lab: '물리 · 전기와 자기',
    question: '어떤 전기 회로에 12V 전압을 가했더니 2A의 전류가 흘렀습니다. 이 회로의 저항을 2배로 늘리고 전압을 6V로 낮춘다면 흐르는 전류는 몇 A가 될까요?',
    options: [
      '0.5 A',
      '1.0 A',
      '2.0 A',
      '4.0 A'
    ],
    correctIndex: 0,
    explanation: '처음 저항 R = V/I = 12V/2A = 6Ω 입니다. 저항이 2배가 되면 12Ω이 되고, 전압이 6V이므로 새로운 전류 I = 6V / 12Ω = 0.5A가 됩니다.'
  },
  {
    id: 4,
    lab: '물리 · 빛과 파동',
    question: '빛이 굴절률이 큰 매질(물)에서 굴절률이 작은 매질(공기)로 진행할 때, 굴절각이 90°가 되는 순간의 입사각을 무엇이라고 부를까요?',
    options: [
      '반사각',
      '분산각',
      '임계각 (Critical Angle)',
      '편광각'
    ],
    correctIndex: 2,
    explanation: '굴절각이 90°가 될 때의 입사각을 임계각이라고 하며, 입사각이 임계각보다 커지면 빛이 100% 반사되는 전반사가 일어납니다.'
  },
  {
    id: 5,
    lab: '화학 · 산과 염기',
    question: 'BTB 용액을 떨어뜨린 묽은 염산(노란색)에 수산화나트륨 용액을 계속 첨가할 때 나타나는 색깔 변화 순서로 옳은 것은?',
    options: [
      '노란색 → 파란색 → 초록색',
      '노란색 → 초록색 → 파란색',
      '초록색 → 노란색 → 빨간색',
      '무색 → 붉은색 → 파란색'
    ],
    correctIndex: 1,
    explanation: 'BTB 용액은 산성에서 노란색, 중성에서 초록색, 염기성에서 파란색을 띱니다. 따라서 염산(산성)에 수산화나트륨(염기성)을 넣으면 노랑 → 초록(중화) → 파랑으로 변합니다.'
  }
];

export const QuizRankings: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [isQuizComplete, setIsQuizComplete] = useState<boolean>(false);

  // Leaderboard states
  const [nickname, setNickname] = useState<string>('');
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [leaderboard, setLeaderboard] = useState<Score[]>([]);
  const [isLoadingScores, setIsLoadingScores] = useState<boolean>(false);

  useEffect(() => {
    loadLeaderboard();
  }, []);

  const loadLeaderboard = async () => {
    setIsLoadingScores(true);
    const data = await fetchScores();
    setLeaderboard(data);
    setIsLoadingScores(false);
  };

  const currentQ = QUESTIONS[currentIndex];

  const handleSelectOption = (idx: number) => {
    if (isAnswered) return;
    setSelectedOption(idx);
    setIsAnswered(true);

    if (idx === currentQ.correctIndex) {
      setScore((prev) => prev + 20); // 5 questions * 20 = 100 points
    }
  };

  const handleNext = () => {
    if (currentIndex < QUESTIONS.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setIsQuizComplete(true);
      confetti({ particleCount: 100, spread: 80, origin: { y: 0.5 } });
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setIsQuizComplete(false);
    setIsSubmitted(false);
  };

  const handleSubmitScore = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nickname.trim() || isSubmitted) return;

    await submitScore(nickname.trim(), score);
    setIsSubmitted(true);
    await loadLeaderboard();
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-neo-purple p-5 rounded-2xl neo-border shadow-brutal flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-white">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 bg-black text-white text-xs font-black rounded uppercase">
              실험 탐구 평가
            </span>
            <h2 className="text-2xl font-black text-white">중등 과학 탐구 퀴즈 & 명예의 전당</h2>
          </div>
          <p className="text-sm font-semibold text-white/90 mt-1">
            4가지 가상실험에서 학습한 원리를 퀴즈로 풀고, 실시간 점수 랭킹에 자신의 닉네임을 등록해 보세요!
          </p>
        </div>

        <div className="flex items-center gap-2 bg-black/40 px-3.5 py-2 rounded-xl border-2 border-white">
          <Trophy className="w-5 h-5 text-neo-yellow" />
          <span className="font-black text-sm">현재 획득 점수: {score}점 / 100점</span>
        </div>
      </div>

      {/* Main Grid: Quiz Arena & Leaderboard */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Quiz Arena */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-800 p-6 rounded-2xl neo-border shadow-brutal min-h-[500px] flex flex-col justify-between">
          
          {!isQuizComplete ? (
            <div className="space-y-5">
              
              {/* Question Header & Progress */}
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 bg-neo-yellow text-black text-xs font-black rounded-lg border-2 border-black shadow-[2px_2px_0px_#000]">
                  {currentQ.lab}
                </span>
                <span className="text-xs font-black text-gray-500">
                  문제 {currentIndex + 1} / {QUESTIONS.length}
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full h-2.5 bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden border border-black">
                <div 
                  className="h-full bg-neo-purple transition-all duration-300"
                  style={{ width: `${((currentIndex + 1) / QUESTIONS.length) * 100}%` }}
                />
              </div>

              {/* Question Text */}
              <h3 className="text-lg sm:text-xl font-black text-gray-900 dark:text-white leading-relaxed">
                Q{currentIndex + 1}. {currentQ.question}
              </h3>

              {/* Options */}
              <div className="space-y-2.5 pt-2">
                {currentQ.options.map((opt, idx) => {
                  let btnStyle = 'bg-gray-50 dark:bg-slate-700 hover:bg-gray-100 text-gray-800 dark:text-gray-200';
                  
                  if (isAnswered) {
                    if (idx === currentQ.correctIndex) {
                      btnStyle = 'bg-green-300 dark:bg-green-700 text-black dark:text-white font-black border-green-600';
                    } else if (idx === selectedOption) {
                      btnStyle = 'bg-red-300 dark:bg-red-800 text-black dark:text-white border-red-600';
                    } else {
                      btnStyle = 'opacity-50 bg-gray-100 dark:bg-slate-800';
                    }
                  }

                  return (
                    <button
                      key={idx}
                      disabled={isAnswered}
                      onClick={() => handleSelectOption(idx)}
                      className={`w-full p-3.5 rounded-xl border-2 border-black text-left font-bold text-sm transition-all flex items-center justify-between ${btnStyle} shadow-[2px_2px_0px_#000]`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-full bg-black text-white text-xs flex items-center justify-center font-black">
                          {idx + 1}
                        </span>
                        <span>{opt}</span>
                      </div>
                      {isAnswered && idx === currentQ.correctIndex && (
                        <CheckCircle className="w-5 h-5 text-green-700 dark:text-green-300" />
                      )}
                      {isAnswered && idx === selectedOption && idx !== currentQ.correctIndex && (
                        <XCircle className="w-5 h-5 text-red-600" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Explanation Banner */}
              {isAnswered && (
                <div className="p-4 bg-neo-yellow/20 rounded-xl border-2 border-black space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-black text-gray-800 dark:text-gray-200">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    <span>정답 해설 노트:</span>
                  </div>
                  <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 leading-normal">
                    {currentQ.explanation}
                  </p>
                </div>
              )}

              {/* Next Button */}
              {isAnswered && (
                <div className="pt-2 flex justify-end">
                  <button
                    onClick={handleNext}
                    className="neo-btn px-6 py-2.5 bg-neo-green text-black rounded-xl text-sm font-black flex items-center gap-2"
                  >
                    <span>{currentIndex < QUESTIONS.length - 1 ? '다음 문제로' : '결과 확인하기'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}

            </div>
          ) : (
            /* Quiz Completed View */
            <div className="py-8 flex flex-col items-center justify-center text-center space-y-6">
              <div className="w-20 h-20 rounded-full bg-neo-yellow border-3 border-black shadow-[4px_4px_0px_#000] flex items-center justify-center">
                <Trophy className="w-10 h-10 text-black stroke-[2.5]" />
              </div>

              <div>
                <h3 className="text-2xl font-black text-gray-900 dark:text-white">
                  탐구 챌린지 완료!
                </h3>
                <p className="text-sm font-bold text-gray-600 dark:text-gray-300 mt-1">
                  중학교 과학 실험 퀴즈를 모두 마쳤습니다.
                </p>
                <div className="text-5xl font-black text-neo-purple mt-3">
                  {score}점 <span className="text-xl text-gray-500">/ 100점</span>
                </div>
              </div>

              {/* Submit Score to Leaderboard */}
              {!isSubmitted ? (
                <form onSubmit={handleSubmitScore} className="w-full max-w-sm space-y-3">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="랭킹에 등록할 닉네임 입력"
                      value={nickname}
                      onChange={(e) => setNickname(e.target.value)}
                      maxLength={12}
                      required
                      className="flex-1 px-4 py-2.5 rounded-xl border-2 border-black dark:border-white font-bold text-sm bg-white dark:bg-slate-700 text-black dark:text-white shadow-[2px_2px_0px_#000]"
                    />
                    <button
                      type="submit"
                      className="neo-btn px-5 py-2.5 bg-neo-green text-black rounded-xl text-sm font-black flex items-center gap-1.5"
                    >
                      <Send className="w-4 h-4" />
                      <span>등록</span>
                    </button>
                  </div>
                  <p className="text-[11px] font-semibold text-gray-500">
                    * Supabase `scores` 테이블에 실시간으로 기록됩니다.
                  </p>
                </form>
              ) : (
                <div className="p-3 bg-green-100 dark:bg-green-900/40 rounded-xl border-2 border-green-600 text-green-800 dark:text-green-300 font-black text-sm">
                  🎉 명예의 전당 랭킹에 성공적으로 등록되었습니다!
                </div>
              )}

              <button
                onClick={handleRestart}
                className="neo-btn px-6 py-2 bg-gray-200 dark:bg-slate-700 text-black dark:text-white rounded-xl text-xs font-black flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>퀴즈 다시 풀기</span>
              </button>
            </div>
          )}

        </div>

        {/* Right: Real-time Leaderboard (Supabase scores table) */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-800 p-6 rounded-2xl neo-border shadow-brutal space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Medal className="w-5 h-5 text-amber-500" />
              <h3 className="text-base font-black text-black dark:text-white uppercase">
                실시간 명예의 전당 (Top 10)
              </h3>
            </div>
            <button
              onClick={loadLeaderboard}
              className="text-xs font-black px-2 py-1 bg-gray-100 dark:bg-slate-700 rounded border border-black hover:bg-gray-200"
            >
              새로고침
            </button>
          </div>

          <p className="text-xs font-bold text-gray-500">
            데이터베이스(Supabase scores 테이블)와 자동 동기화되는 점수 랭킹입니다.
          </p>

          {/* Scores Table */}
          <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
            {leaderboard.map((item, idx) => {
              const isTop3 = idx < 3;
              const medalColors = ['bg-neo-yellow text-black', 'bg-slate-300 text-black', 'bg-amber-600 text-white'];
              
              return (
                <div
                  key={item.id || idx}
                  className={`p-3 rounded-xl border-2 border-black flex items-center justify-between text-xs font-black shadow-[2px_2px_0px_#000] ${
                    isTop3 ? 'bg-amber-50 dark:bg-slate-700' : 'bg-white dark:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center border border-black ${
                      isTop3 ? medalColors[idx] : 'bg-gray-200 text-gray-700'
                    }`}>
                      {idx + 1}
                    </span>
                    <span className="text-gray-900 dark:text-white text-sm">
                      {item.nickname}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-gray-400">
                      {new Date(item.played_at).toLocaleDateString()}
                    </span>
                    <span className="text-sm font-black text-neo-purple dark:text-purple-400">
                      {item.score}점
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

        </div>

      </div>

    </div>
  );
};
