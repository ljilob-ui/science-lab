import React, { useState } from 'react';
import { RotateCcw, Plus, Play, Pause, Info, Award, Flame, Droplets } from 'lucide-react';
import confetti from 'canvas-confetti';

type IndicatorType = 'btb' | 'phenolphthalein' | 'universal';

export const AcidBaseLab: React.FC = () => {
  const [naohVolume, setNaohVolume] = useState<number>(0);
  const [indicator, setIndicator] = useState<IndicatorType>('btb');
  const [isDripping, setIsDripping] = useState<boolean>(false);
  const [hasCelebrated, setHasCelebrated] = useState<boolean>(false);

  const initialHclVol = 20; // 20 mL of 0.1M HCl
  const hclMolarity = 0.1;
  const naohMolarity = 0.1;

  // Chemistry math
  const acidMoles = initialHclVol * hclMolarity; // 2.0 mmol
  const baseMoles = naohVolume * naohMolarity;
  const totalVolume = initialHclVol + naohVolume;

  let ph = 7;
  let hMoles = 0;
  let ohMoles = 0;

  if (baseMoles < acidMoles) {
    hMoles = acidMoles - baseMoles;
    const hConc = hMoles / totalVolume;
    ph = Math.max(1.0, Math.min(6.9, -Math.log10(hConc)));
  } else if (baseMoles > acidMoles) {
    ohMoles = baseMoles - acidMoles;
    const ohConc = ohMoles / totalVolume;
    const poh = -Math.log10(ohConc);
    ph = Math.min(13.5, Math.max(7.1, 14 - poh));
  } else {
    ph = 7.0;
  }

  // Round ph
  const displayPh = Number(ph.toFixed(2));

  // Temperature calculation (중화열)
  const maxTemp = 32;
  const baseTemp = 20;
  const reactedMoles = Math.min(acidMoles, baseMoles);
  const tempRise = (reactedMoles / 2.0) * (maxTemp - baseTemp);
  const dilutionFactor = initialHclVol / totalVolume;
  const temperature = Number((baseTemp + tempRise * (0.6 + 0.4 * dilutionFactor)).toFixed(1));

  // Indicator color
  const getIndicatorColor = () => {
    if (indicator === 'btb') {
      if (ph < 6.0) return 'rgba(255, 230, 0, 0.85)'; // Yellow (Acid)
      if (ph > 7.6) return 'rgba(37, 99, 235, 0.85)'; // Blue (Base)
      return 'rgba(16, 185, 129, 0.85)'; // Green (Neutral)
    }
    if (indicator === 'phenolphthalein') {
      if (ph >= 8.3) return 'rgba(236, 72, 153, 0.85)'; // Vivid Pink (Base)
      return 'rgba(224, 242, 254, 0.4)'; // Colorless / slightly transparent
    }
    // Universal indicator
    if (ph <= 2) return 'rgba(239, 68, 68, 0.9)'; // Red
    if (ph <= 4) return 'rgba(249, 115, 22, 0.9)'; // Orange
    if (ph <= 6) return 'rgba(234, 179, 8, 0.9)'; // Yellow
    if (ph <= 8) return 'rgba(34, 197, 94, 0.9)'; // Green
    if (ph <= 10) return 'rgba(6, 182, 212, 0.9)'; // Blue
    if (ph <= 12) return 'rgba(99, 102, 241, 0.9)'; // Indigo
    return 'rgba(168, 85, 247, 0.9)'; // Violet
  };

  // Add NaOH
  const addNaoh = (amount: number) => {
    setNaohVolume((prev) => {
      const next = Math.min(40, Number((prev + amount).toFixed(1)));
      if (Math.abs(next - 20) <= 0.5 && !hasCelebrated) {
        confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
        setHasCelebrated(true);
      }
      return next;
    });
  };

  // Auto dripping loop
  React.useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (isDripping) {
      interval = setInterval(() => {
        setNaohVolume((prev) => {
          if (prev >= 40) {
            setIsDripping(false);
            return 40;
          }
          const next = Number((prev + 0.5).toFixed(1));
          if (Math.abs(next - 20) <= 0.5 && !hasCelebrated) {
            confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
            setHasCelebrated(true);
          }
          return next;
        });
      }, 300);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isDripping, hasCelebrated]);

  const handleReset = () => {
    setNaohVolume(0);
    setIsDripping(false);
    setHasCelebrated(false);
  };

  // Ion particles count (relative scale)
  const hIonCount = Math.round(hMoles * 10);
  const ohIonCount = Math.round(ohMoles * 10);
  const naIonCount = Math.round(baseMoles * 10);
  const clIonCount = Math.round(acidMoles * 10); // constant 20

  return (
    <div className="space-y-6">
      
      {/* Header Info Banner */}
      <div className="bg-neo-pink p-5 rounded-2xl neo-border shadow-brutal flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 bg-black text-white text-xs font-black rounded uppercase">
              중3 화학 · 물질의 변화
            </span>
            <h2 className="text-2xl font-black text-black">산·염기 중화반응 & 지시약 변색 실험</h2>
          </div>
          <p className="text-sm font-semibold text-black/80 mt-1">
            0.1M 염산(HCl) 20mL에 0.1M 수산화나트륨(NaOH)을 떨어뜨리며 pH, 이온수, 중화열의 변화를 실시간으로 탐구합니다.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {displayPh === 7.0 && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-neo-green text-black font-black text-sm rounded-xl border-2 border-black shadow-[2px_2px_0px_#000] animate-bounce">
              <Award className="w-5 h-5" />
              <span>완전 중화점 도달! (pH 7.0)</span>
            </div>
          )}
        </div>
      </div>

      {/* Main Experiment Arena */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Apparatus View (Burette & Beaker) */}
        <div className="lg:col-span-6 bg-white dark:bg-slate-800 p-6 rounded-2xl neo-border shadow-brutal flex flex-col items-center justify-between min-h-[540px] relative overflow-hidden">
          
          {/* Top: Burette */}
          <div className="w-full flex flex-col items-center">
            <div className="w-24 bg-blue-50 dark:bg-slate-700 border-3 border-black dark:border-white rounded-t-lg p-2 text-center shadow-[3px_3px_0px_#000]">
              <span className="text-xs font-black block">뷰렛 (NaOH)</span>
              <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
                {(40 - naohVolume).toFixed(1)} mL 남음
              </span>
            </div>
            
            {/* Burette Column */}
            <div className="w-12 h-36 border-x-3 border-b-3 border-black dark:border-white bg-slate-100 dark:bg-slate-900 relative overflow-hidden">
              {/* NaOH Liquid level */}
              <div 
                className="absolute bottom-0 w-full bg-blue-400/80 transition-all duration-300"
                style={{ height: `${((40 - naohVolume) / 40) * 100}%` }}
              />
              {/* Graduations */}
              <div className="absolute inset-0 flex flex-col justify-between p-1 opacity-60 pointer-events-none">
                {[0, 10, 20, 30, 40].map((mark) => (
                  <div key={mark} className="w-3 border-b border-black dark:border-white text-[8px] font-bold">
                    {mark}
                  </div>
                ))}
              </div>
            </div>

            {/* Burette Cock & Nozzle */}
            <div className="w-4 h-6 bg-gray-400 border-x-2 border-black dark:border-white relative flex items-center justify-center">
              <div className={`w-8 h-2.5 bg-neo-yellow border-2 border-black rounded transition-transform ${isDripping ? 'rotate-90' : 'rotate-0'}`} />
            </div>
            <div className="w-1.5 h-4 bg-gray-300 border-x-2 border-black dark:border-white" />

            {/* Droplet Animation */}
            {isDripping && (
              <div className="w-2.5 h-3 bg-blue-400 rounded-full animate-bounce my-1 border border-black shadow-sm" />
            )}
            {!isDripping && <div className="h-5" />}
          </div>

          {/* Bottom: Reaction Beaker */}
          <div className="relative w-64 h-56 border-x-4 border-b-4 border-black dark:border-white rounded-b-3xl bg-slate-50/70 dark:bg-slate-900/70 overflow-hidden shadow-[4px_4px_0px_#000] dark:shadow-[4px_4px_0px_#fff]">
            
            {/* Beaker Lip / Top rim */}
            <div className="absolute top-0 w-full h-2 border-b-2 border-dashed border-gray-400" />
            
            {/* Liquid inside beaker */}
            <div 
              className="absolute bottom-0 w-full transition-all duration-300 flex items-center justify-center"
              style={{ 
                height: `${Math.min(92, ((initialHclVol + naohVolume) / 60) * 100)}%`,
                backgroundColor: getIndicatorColor()
              }}
            >
              {/* Ion visualization inside beaker */}
              <div className="absolute inset-0 flex flex-wrap items-center justify-around p-3 overflow-hidden opacity-90 select-none">
                {Array.from({ length: Math.min(8, hIonCount) }).map((_, i) => (
                  <span key={'h-' + i} className="text-xs font-black bg-red-600 text-white px-1.5 py-0.5 rounded-full border border-black shadow-sm scale-90 animate-pulse">
                    H⁺
                  </span>
                ))}
                {Array.from({ length: Math.min(8, ohIonCount) }).map((_, i) => (
                  <span key={'oh-' + i} className="text-xs font-black bg-blue-600 text-white px-1.5 py-0.5 rounded-full border border-black shadow-sm scale-90 animate-pulse">
                    OH⁻
                  </span>
                ))}
                {Array.from({ length: Math.min(8, naIonCount) }).map((_, i) => (
                  <span key={'na-' + i} className="text-[10px] font-bold bg-amber-400 text-black px-1 rounded border border-black">
                    Na⁺
                  </span>
                ))}
                {Array.from({ length: Math.min(8, clIonCount) }).map((_, i) => (
                  <span key={'cl-' + i} className="text-[10px] font-bold bg-emerald-400 text-black px-1 rounded border border-black">
                    Cl⁻
                  </span>
                ))}
              </div>

              {/* Liquid surface wave */}
              <div className="absolute top-0 left-0 right-0 h-2 bg-white/30 rounded-full" />
            </div>

            {/* Volume Scale on Beaker */}
            <div className="absolute left-2 inset-y-4 flex flex-col justify-between text-[9px] font-black text-black/60 dark:text-white/60 pointer-events-none">
              <span>60 mL</span>
              <span>40 mL</span>
              <span>20 mL</span>
              <span>0 mL</span>
            </div>

            {/* Liquid Volume Badge */}
            <div className="absolute right-3 bottom-3 px-2 py-1 bg-white/90 dark:bg-black/90 rounded-lg border-2 border-black dark:border-white text-xs font-black shadow-[2px_2px_0px_#000]">
              총 용액: {totalVolume.toFixed(1)} mL
            </div>
          </div>

          {/* Chemical Equation Bar */}
          <div className="mt-4 w-full p-2.5 bg-slate-100 dark:bg-slate-700/60 rounded-xl border-2 border-black dark:border-white text-center font-bold text-xs sm:text-sm">
            <span className="text-red-500 font-black">HCl (산)</span> + <span className="text-blue-500 font-black">NaOH (염기)</span> → <span className="text-green-600 dark:text-green-400 font-black">NaCl (염)</span> + <span className="text-cyan-500 font-black">H₂O (물)</span> + <span className="text-amber-500 font-black">열🔥</span>
          </div>
        </div>

        {/* Right: Controls & Real-Time Sensors */}
        <div className="lg:col-span-6 space-y-6">
          
          {/* Sensor Gauges Grid */}
          <div className="grid grid-cols-2 gap-4">
            
            {/* pH Meter */}
            <div className="p-4 bg-neo-yellow/20 dark:bg-slate-800 rounded-2xl neo-border shadow-brutal flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase text-gray-700 dark:text-gray-300">디지털 pH 미터</span>
                <span className={`text-xs font-black px-2 py-0.5 rounded border border-black ${
                  displayPh < 7 ? 'bg-red-400 text-white' : displayPh > 7 ? 'bg-blue-500 text-white' : 'bg-green-500 text-white'
                }`}>
                  {displayPh < 7 ? '산성' : displayPh > 7 ? '염기성' : '중성'}
                </span>
              </div>
              <div className="my-3 text-center">
                <div className="text-4xl font-black text-black dark:text-white tracking-tight">
                  pH {displayPh}
                </div>
              </div>
              {/* Progress bar */}
              <div className="w-full h-3 bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden border border-black">
                <div 
                  className="h-full bg-gradient-to-r from-red-500 via-green-500 to-blue-500 transition-all duration-300"
                  style={{ width: `${(displayPh / 14) * 100}%` }}
                />
              </div>
            </div>

            {/* Temperature Meter (중화열) */}
            <div className="p-4 bg-neo-pink/20 dark:bg-slate-800 rounded-2xl neo-border shadow-brutal flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase text-gray-700 dark:text-gray-300">용액 온도 (중화열)</span>
                <Flame className="w-4 h-4 text-red-500" />
              </div>
              <div className="my-3 text-center">
                <div className="text-4xl font-black text-red-500 tracking-tight">
                  {temperature} °C
                </div>
              </div>
              <div className="text-[11px] font-semibold text-gray-600 dark:text-gray-400 text-center">
                {displayPh === 7 ? '🔥 최대 발열점 (완전 중화)' : '중화 반응열 방출 중'}
              </div>
            </div>

          </div>

          {/* Indicator Selector */}
          <div className="p-4 bg-white dark:bg-slate-800 rounded-2xl neo-border shadow-brutal space-y-3">
            <span className="text-xs font-black text-gray-700 dark:text-gray-300 uppercase block">
              지시약 선택 (Indicator)
            </span>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'btb' as IndicatorType, name: 'BTB 용액', tip: '노랑(산) ↔ 초록(중) ↔ 파랑(염)' },
                { id: 'phenolphthalein' as IndicatorType, name: '페놀프탈레인', tip: '무색(산/중) ↔ 붉은색(염)' },
                { id: 'universal' as IndicatorType, name: '만능 지시약', tip: '무지개 스펙트럼 pH' },
              ].map((ind) => (
                <button
                  key={ind.id}
                  onClick={() => setIndicator(ind.id)}
                  className={`p-2.5 rounded-xl border-2 border-black dark:border-white font-black text-xs text-left transition-all ${
                    indicator === ind.id 
                      ? 'bg-neo-cyan text-black shadow-[2px_2px_0px_#000] -translate-y-0.5' 
                      : 'bg-gray-50 dark:bg-slate-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100'
                  }`}
                >
                  <div>{ind.name}</div>
                  <div className="text-[10px] font-normal text-gray-600 dark:text-gray-300 truncate mt-0.5">
                    {ind.tip}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Burette Controls */}
          <div className="p-5 bg-white dark:bg-slate-800 rounded-2xl neo-border shadow-brutal space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-gray-700 dark:text-gray-300 uppercase">
                NaOH 용액 주입 제어 (누적 주입: {naohVolume.toFixed(1)} mL)
              </span>
              <button
                onClick={handleReset}
                className="flex items-center gap-1 px-2.5 py-1 text-xs font-bold rounded-lg border-2 border-black bg-gray-200 dark:bg-slate-700 hover:bg-gray-300 shadow-[2px_2px_0px_#000]"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>초기화</span>
              </button>
            </div>

            {/* Quick Add Buttons */}
            <div className="grid grid-cols-4 gap-2">
              {[1, 2, 5, 10].map((amt) => (
                <button
                  key={amt}
                  disabled={naohVolume >= 40}
                  onClick={() => addNaoh(amt)}
                  className="neo-btn py-2 bg-neo-yellow text-black text-xs rounded-xl disabled:opacity-50"
                >
                  +{amt} mL
                </button>
              ))}
            </div>

            {/* Continuous Dripping Toggle */}
            <button
              onClick={() => setIsDripping(!isDripping)}
              disabled={naohVolume >= 40}
              className={`w-full py-3 rounded-xl neo-btn flex items-center justify-center gap-2 text-sm ${
                isDripping ? 'bg-red-400 text-white' : 'bg-neo-green text-black'
              } disabled:opacity-50`}
            >
              {isDripping ? (
                <>
                  <Pause className="w-4 h-4 fill-white" />
                  <span>연속 적정 정지</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-black" />
                  <span>자동 연속 적정 시작 (0.5 mL/초)</span>
                </>
              )}
            </button>
          </div>

          {/* Ion Count Distribution */}
          <div className="p-4 bg-slate-50 dark:bg-slate-800/80 rounded-2xl neo-border shadow-brutal space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-gray-700 dark:text-gray-300 uppercase">
                비커 속 실시간 이온 수 비율 (이온 모형)
              </span>
              <Info className="w-4 h-4 text-gray-400" />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-red-500">수소 이온 (H⁺): {hIonCount} 개</span>
                <span className="text-blue-500">수산화 이온 (OH⁻): {ohIonCount} 개</span>
              </div>
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-amber-500">나트륨 이온 (Na⁺ 구경꾼): {naIonCount} 개</span>
                <span className="text-emerald-500">염화 이온 (Cl⁻ 구경꾼): {clIonCount} 개</span>
              </div>

              {/* Stacked Ion Graph */}
              <div className="h-4 w-full bg-gray-200 dark:bg-slate-700 rounded-lg overflow-hidden border border-black flex">
                <div className="bg-red-500 transition-all duration-300" style={{ width: `${(hIonCount / 50) * 100}%` }} title="H+" />
                <div className="bg-blue-500 transition-all duration-300" style={{ width: `${(ohIonCount / 50) * 100}%` }} title="OH-" />
                <div className="bg-amber-400 transition-all duration-300" style={{ width: `${(naIonCount / 50) * 100}%` }} title="Na+" />
                <div className="bg-emerald-400 transition-all duration-300" style={{ width: `${(clIonCount / 50) * 100}%` }} title="Cl-" />
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
