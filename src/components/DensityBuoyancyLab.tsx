import React, { useState } from 'react';
import { Waves, ArrowDown, ArrowUp, RefreshCw, Compass, CheckCircle2 } from 'lucide-react';

interface Material {
  id: string;
  name: string;
  density: number; // g/cm³
  mass: number; // g
  volume: number; // cm³
  color: string;
  type: string;
}

const PRESET_MATERIALS: Material[] = [
  { id: 'wood', name: '나무 토막', density: 0.60, mass: 60, volume: 100, color: 'bg-amber-700', type: '고체' },
  { id: 'ice', name: '얼음 덩어리', density: 0.92, mass: 92, volume: 100, color: 'bg-cyan-200 border-cyan-400', type: '고체' },
  { id: 'plastic', name: '플라스틱 블록', density: 0.95, mass: 95, volume: 100, color: 'bg-emerald-500', type: '고체' },
  { id: 'rubber', name: '고무 지우개', density: 1.30, mass: 130, volume: 100, color: 'bg-purple-600', type: '고체' },
  { id: 'aluminum', name: '알루미늄 큐브', density: 2.70, mass: 270, volume: 100, color: 'bg-slate-400', type: '금속' },
  { id: 'iron', name: '쇠구슬', density: 7.87, mass: 787, volume: 100, color: 'bg-zinc-800', type: '금속' },
];

interface Liquid {
  id: string;
  name: string;
  density: number; // g/cm³
  color: string;
  labelColor: string;
}

const LIQUIDS: Liquid[] = [
  { id: 'water', name: '물 (Water)', density: 1.00, color: 'bg-blue-400/50', labelColor: 'text-blue-600' },
  { id: 'oil', name: '식용유 (Cooking Oil)', density: 0.92, color: 'bg-amber-200/60', labelColor: 'text-amber-700' },
  { id: 'saltwater', name: '진한 소금물 (Salt Water)', density: 1.15, color: 'bg-teal-300/50', labelColor: 'text-teal-700' },
  { id: 'glycerin', name: '글리세린 (Glycerin)', density: 1.26, color: 'bg-purple-300/40', labelColor: 'text-purple-700' },
];

export const DensityBuoyancyLab: React.FC = () => {
  const [selectedLiquid, setSelectedLiquid] = useState<Liquid>(LIQUIDS[0]);
  const [selectedMaterial, setSelectedMaterial] = useState<Material>(PRESET_MATERIALS[0]);
  const [isLayeredMode, setIsLayeredMode] = useState<boolean>(false);
  const [customMass, setCustomMass] = useState<number>(80);
  const [customVolume, setCustomVolume] = useState<number>(100);
  const [isCustom, setIsCustom] = useState<boolean>(false);

  // Active object properties
  const activeDensity = isCustom ? Number((customMass / customVolume).toFixed(2)) : selectedMaterial.density;
  const activeMass = isCustom ? customMass : selectedMaterial.mass;
  const activeVolume = isCustom ? customVolume : selectedMaterial.volume;
  const activeName = isCustom ? '커스텀 물체' : selectedMaterial.name;
  const activeColor = isCustom ? 'bg-neo-yellow' : selectedMaterial.color;

  // Physics calculation
  // g = 9.8 m/s^2, 1 g/cm^3 = 1000 kg/m^3. For educational display, we use Newton relative scale.
  const gravityForce = Number(((activeMass * 9.8) / 100).toFixed(2)); // N scale

  // Submerged percentage & Buoyant force
  let submergedPercent = 0;
  let buoyantForce = 0;
  let statusText = '';
  let verticalPosPercent = 0; // 0: floating at top, 100: sunken to bottom

  if (!isLayeredMode) {
    if (activeDensity < selectedLiquid.density) {
      submergedPercent = (activeDensity / selectedLiquid.density) * 100;
      buoyantForce = gravityForce; // In floating equilibrium, Fb = Fg
      statusText = `물에 뜸 (일부 잠김: ${submergedPercent.toFixed(1)}%)`;
      verticalPosPercent = (100 - submergedPercent) * 0.35 + 25; 
    } else if (Math.abs(activeDensity - selectedLiquid.density) < 0.01) {
      submergedPercent = 100;
      buoyantForce = gravityForce;
      statusText = '중성 부력 (액체 내부에 정지)';
      verticalPosPercent = 55;
    } else {
      submergedPercent = 100;
      // Max buoyant force when fully submerged
      buoyantForce = Number(((selectedLiquid.density * activeVolume * 9.8) / 100).toFixed(2));
      statusText = '바닥으로 가라앉음 (밀도 초과)';
      verticalPosPercent = 88; // On bottom
    }
  } else {
    // Multi-layer mode: Oil (0.92) at top, Water (1.00) at middle, Glycerin (1.26) at bottom
    if (activeDensity < 0.92) {
      statusText = '식용유 층 위로 뜸 (최상단)';
      verticalPosPercent = 20;
      buoyantForce = gravityForce;
    } else if (activeDensity < 1.00) {
      statusText = '식용유와 물 경계면에 부유';
      verticalPosPercent = 42;
      buoyantForce = gravityForce;
    } else if (activeDensity < 1.26) {
      statusText = '물과 글리세린 경계면에 부유';
      verticalPosPercent = 68;
      buoyantForce = gravityForce;
    } else {
      statusText = '글리세린 바닥으로 완전 침강';
      verticalPosPercent = 90;
      buoyantForce = Number(((1.26 * activeVolume * 9.8) / 100).toFixed(2));
    }
  }

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-neo-cyan p-5 rounded-2xl neo-border shadow-brutal flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 bg-black text-white text-xs font-black rounded uppercase">
              중2 물리 · 물질의 특성
            </span>
            <h2 className="text-2xl font-black text-black">밀도와 부력 챔버 (아르키메데스 랩)</h2>
          </div>
          <p className="text-sm font-semibold text-black/80 mt-1">
            다양한 액체의 밀도와 물체의 부피·질량에 따른 부력 벡터(↑)와 중력 벡터(↓)의 평형 상태를 관찰합니다.
          </p>
        </div>
        <button
          onClick={() => setIsLayeredMode(!isLayeredMode)}
          className={`neo-btn px-4 py-2 rounded-xl text-sm font-black flex items-center gap-2 ${
            isLayeredMode ? 'bg-neo-yellow text-black' : 'bg-white text-black'
          }`}
        >
          <Waves className="w-4 h-4" />
          <span>{isLayeredMode ? '단일 액체 모드로 전환' : '다층 액체(밀도 탑) 모드 실행'}</span>
        </button>
      </div>

      {/* Main Simulation Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Cylinder Visualization */}
        <div className="lg:col-span-6 bg-white dark:bg-slate-800 p-6 rounded-2xl neo-border shadow-brutal flex flex-col items-center justify-between min-h-[520px] relative">
          
          <div className="text-center w-full">
            <span className="text-xs font-black uppercase text-gray-500 tracking-wider">
              {isLayeredMode ? '3단 밀도 탑 (식용유 - 물 - 글리세린)' : `메스실린더 [ ${selectedLiquid.name} ]`}
            </span>
          </div>

          {/* Cylinder Tube */}
          <div className="relative w-56 h-96 border-x-4 border-b-4 border-black dark:border-white rounded-b-3xl bg-slate-50 dark:bg-slate-900/60 overflow-hidden shadow-[4px_4px_0px_#000] my-2">
            
            {/* Liquid Rendering */}
            {!isLayeredMode ? (
              <div 
                className={`absolute inset-x-0 bottom-0 h-[85%] ${selectedLiquid.color} transition-colors duration-500 flex flex-col justify-end p-2`}
              >
                <div className="absolute top-0 inset-x-0 h-3 bg-white/40 border-b border-black/20" />
                <span className="text-[11px] font-black opacity-70 text-right">
                  {selectedLiquid.name} (ρ = {selectedLiquid.density} g/cm³)
                </span>
              </div>
            ) : (
              /* Multi-layer Density Tower */
              <div className="absolute inset-x-0 bottom-0 h-[90%] flex flex-col">
                {/* Top Layer: Cooking Oil */}
                <div className="flex-1 bg-amber-200/70 border-b-2 border-dashed border-black/40 flex items-center justify-end pr-2">
                  <span className="text-[10px] font-black text-amber-900">식용유 (0.92 g/cm³)</span>
                </div>
                {/* Middle Layer: Water */}
                <div className="flex-1 bg-blue-300/60 border-b-2 border-dashed border-black/40 flex items-center justify-end pr-2">
                  <span className="text-[10px] font-black text-blue-900">물 (1.00 g/cm³)</span>
                </div>
                {/* Bottom Layer: Glycerin */}
                <div className="flex-1 bg-purple-300/60 flex items-center justify-end pr-2">
                  <span className="text-[10px] font-black text-purple-900">글리세린 (1.26 g/cm³)</span>
                </div>
              </div>
            )}

            {/* Test Object Inside Cylinder */}
            <div 
              className={`absolute left-1/2 -translate-x-1/2 w-20 h-20 rounded-xl border-3 border-black shadow-[3px_3px_0px_#000] flex flex-col items-center justify-center text-center transition-all duration-700 ease-out z-20 ${activeColor}`}
              style={{ top: `${verticalPosPercent}%` }}
            >
              <span className="text-[11px] font-black text-black leading-tight px-1">
                {activeName}
              </span>
              <span className="text-[9px] font-bold text-black/80">
                {activeDensity} g/cm³
              </span>

              {/* Vector Force Arrows */}
              {/* Buoyant Force (Up Vector) */}
              <div className="absolute -top-7 flex flex-col items-center text-cyan-600 animate-pulse">
                <ArrowUp className="w-5 h-5 stroke-[3]" />
                <span className="text-[9px] font-black bg-white/90 px-1 rounded border border-black -mt-1">
                  Fb {buoyantForce}N
                </span>
              </div>

              {/* Gravity Force (Down Vector) */}
              <div className="absolute -bottom-8 flex flex-col items-center text-red-600">
                <span className="text-[9px] font-black bg-white/90 px-1 rounded border border-black -mb-1">
                  Fg {gravityForce}N
                </span>
                <ArrowDown className="w-5 h-5 stroke-[3]" />
              </div>
            </div>

            {/* Height / Graduation lines */}
            <div className="absolute left-2 inset-y-6 flex flex-col justify-between text-[9px] font-black text-black/40 dark:text-white/40 pointer-events-none">
              <span>300 mL</span>
              <span>200 mL</span>
              <span>100 mL</span>
              <span>0 mL</span>
            </div>

          </div>

          {/* Status Message */}
          <div className="w-full p-3 bg-neo-yellow/30 rounded-xl border-2 border-black font-black text-xs sm:text-sm text-center">
            상태 판정: <span className="text-blue-700 dark:text-blue-400">{statusText}</span>
          </div>

        </div>

        {/* Right: Controllers & Preset Selector */}
        <div className="lg:col-span-6 space-y-5">
          
          {/* Liquid Selection (if not layered mode) */}
          {!isLayeredMode && (
            <div className="p-4 bg-white dark:bg-slate-800 rounded-2xl neo-border shadow-brutal space-y-3">
              <span className="text-xs font-black uppercase text-gray-700 dark:text-gray-300 block">
                1. 챔버 액체 선택 (Liquid Selection)
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {LIQUIDS.map((liq) => (
                  <button
                    key={liq.id}
                    onClick={() => setSelectedLiquid(liq)}
                    className={`p-2.5 rounded-xl border-2 border-black dark:border-white font-black text-xs text-center transition-all ${
                      selectedLiquid.id === liq.id
                        ? 'bg-neo-cyan text-black shadow-[2px_2px_0px_#000] -translate-y-0.5'
                        : 'bg-gray-50 dark:bg-slate-700 text-gray-600 dark:text-gray-300'
                    }`}
                  >
                    <div>{liq.name.split(' ')[0]}</div>
                    <div className="text-[10px] font-normal opacity-80 mt-0.5">
                      {liq.density} g/cm³
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Object Material Presets */}
          <div className="p-4 bg-white dark:bg-slate-800 rounded-2xl neo-border shadow-brutal space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase text-gray-700 dark:text-gray-300">
                2. 실험 물체 선택 (Object Selection)
              </span>
              <button
                onClick={() => setIsCustom(!isCustom)}
                className={`text-xs font-black px-2.5 py-1 rounded-lg border-2 border-black ${
                  isCustom ? 'bg-neo-yellow text-black' : 'bg-gray-200 dark:bg-slate-700'
                }`}
              >
                {isCustom ? '✓ 커스텀 물체 사용 중' : '+ 직접 수치 조절'}
              </button>
            </div>

            {!isCustom ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {PRESET_MATERIALS.map((mat) => (
                  <button
                    key={mat.id}
                    onClick={() => {
                      setSelectedMaterial(mat);
                      setIsCustom(false);
                    }}
                    className={`p-2.5 rounded-xl border-2 border-black dark:border-white font-black text-xs text-left transition-all ${
                      selectedMaterial.id === mat.id && !isCustom
                        ? 'bg-neo-yellow text-black shadow-[2px_2px_0px_#000] -translate-y-0.5'
                        : 'bg-gray-50 dark:bg-slate-700 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span>{mat.name}</span>
                      <span className="text-[9px] px-1 bg-black/10 rounded">{mat.type}</span>
                    </div>
                    <div className="text-[10px] font-bold text-gray-500 dark:text-gray-400 mt-1">
                      밀도: {mat.density} g/cm³
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              /* Custom Object Sliders */
              <div className="p-4 bg-slate-100 dark:bg-slate-900 rounded-xl space-y-4 border-2 border-black">
                <div>
                  <div className="flex justify-between text-xs font-black mb-1">
                    <span>물체 질량 (Mass, m):</span>
                    <span className="text-red-500">{customMass} g</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="500"
                    step="5"
                    value={customMass}
                    onChange={(e) => setCustomMass(Number(e.target.value))}
                    className="w-full accent-black cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs font-black mb-1">
                    <span>물체 부피 (Volume, V):</span>
                    <span className="text-blue-500">{customVolume} cm³</span>
                  </div>
                  <input
                    type="range"
                    min="20"
                    max="200"
                    step="5"
                    value={customVolume}
                    onChange={(e) => setCustomVolume(Number(e.target.value))}
                    className="w-full accent-black cursor-pointer"
                  />
                </div>

                <div className="text-center p-2 bg-neo-yellow rounded-lg border-2 border-black font-black text-xs">
                  계산된 밀도 (ρ = m/V): {activeDensity} g/cm³
                </div>
              </div>
            )}
          </div>

          {/* Physics Law Card */}
          <div className="p-5 bg-neo-green/20 dark:bg-slate-800 rounded-2xl neo-border shadow-brutal space-y-3">
            <span className="text-xs font-black uppercase text-gray-700 dark:text-gray-300 block">
              💡 과학 원리 공식 노트 (아르키메데스의 원리)
            </span>
            <div className="space-y-1.5 text-xs font-bold text-gray-800 dark:text-gray-200">
              <p>• <span className="font-black text-black dark:text-white">밀도(Density) = 질량(m) / 부피(V)</span></p>
              <p>• <span className="font-black text-cyan-600">부력(Buoyancy, Fb) = 액체 밀도 × 잠긴 부피 × 중력가속도(g)</span></p>
              <p>• <span className="font-black text-red-500">물체 밀도 &lt; 액체 밀도</span>: 부력 &gt; 중력 발생 → 수면 위로 뜸</p>
              <p>• <span className="font-black text-blue-500">물체 밀도 &gt; 액체 밀도</span>: 부력 &lt; 중력 발생 → 바닥으로 침강</p>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
