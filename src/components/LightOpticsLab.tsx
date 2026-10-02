import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Compass, AlertCircle, Eye, ArrowRight } from 'lucide-react';

interface Medium {
  id: string;
  name: string;
  n: number; // Refractive index
  color: string;
}

const MEDIA: Medium[] = [
  { id: 'air', name: '공기 (Air)', n: 1.00, color: 'rgba(240, 249, 255, 0.2)' },
  { id: 'water', name: '물 (Water)', n: 1.33, color: 'rgba(56, 189, 248, 0.25)' },
  { id: 'glass', name: '유리 (Glass)', n: 1.52, color: 'rgba(168, 85, 247, 0.2)' },
  { id: 'diamond', name: '다이아몬드 (Diamond)', n: 2.42, color: 'rgba(236, 72, 153, 0.2)' },
];

export const LightOpticsLab: React.FC = () => {
  const [incidentAngleDeg, setIncidentAngleDeg] = useState<number>(45); // 0° ~ 85°
  const [medium1, setMedium1] = useState<Medium>(MEDIA[0]); // Air
  const [medium2, setMedium2] = useState<Medium>(MEDIA[1]); // Water
  const [laserColor, setLaserColor] = useState<'red' | 'green'>('green');

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Snell's Law math: n1 * sin(θ1) = n2 * sin(θ2)
  const theta1Rad = (incidentAngleDeg * Math.PI) / 180;
  const sinTheta2 = (medium1.n / medium2.n) * Math.sin(theta1Rad);
  const isTotalInternalReflection = sinTheta2 > 1.0;

  const theta2Rad = !isTotalInternalReflection ? Math.asin(sinTheta2) : 0;
  const refractedAngleDeg = !isTotalInternalReflection ? Number(((theta2Rad * 180) / Math.PI).toFixed(1)) : 0;

  // Critical angle (임계각) if n1 > n2
  const criticalAngleDeg = medium1.n > medium2.n 
    ? Number(((Math.asin(medium2.n / medium1.n) * 180) / Math.PI).toFixed(1)) 
    : null;

  // Canvas ray tracing
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;
    const cx = w / 2;
    const cy = h / 2;

    ctx.clearRect(0, 0, w, h);

    // Medium 1 (Top half)
    ctx.fillStyle = medium1.color;
    ctx.fillRect(0, 0, w, cy);

    // Medium 2 (Bottom half)
    ctx.fillStyle = medium2.color;
    ctx.fillRect(0, cy, w, cy);

    // Boundary interface (경계면)
    ctx.lineWidth = 3;
    ctx.strokeStyle = '#000000';
    ctx.beginPath();
    ctx.moveTo(0, cy);
    ctx.lineTo(w, cy);
    ctx.stroke();

    // Normal line (법선, dashed)
    ctx.setLineDash([5, 5]);
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#64748B';
    ctx.beginPath();
    ctx.moveTo(cx, 10);
    ctx.lineTo(cx, h - 10);
    ctx.stroke();
    ctx.setLineDash([]); // Reset dash

    // Labels for Normal
    ctx.fillStyle = '#64748B';
    ctx.font = 'bold 11px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('법선 (Normal)', cx, 24);

    const beamColor = laserColor === 'green' ? '#10B981' : '#EF4444';
    const beamGlow = laserColor === 'green' ? 'rgba(16, 185, 129, 0.5)' : 'rgba(239, 68, 68, 0.5)';

    // Ray lengths
    const rayLength = 170;

    // 1. Incident Ray (From top left to center)
    const incX = cx - rayLength * Math.sin(theta1Rad);
    const incY = cy - rayLength * Math.cos(theta1Rad);

    ctx.lineWidth = 4;
    ctx.strokeStyle = beamColor;
    ctx.shadowColor = beamGlow;
    ctx.shadowBlur = 10;

    ctx.beginPath();
    ctx.moveTo(incX, incY);
    ctx.lineTo(cx, cy);
    ctx.stroke();

    // Laser Emitter Box
    ctx.shadowBlur = 0;
    ctx.fillStyle = '#000000';
    ctx.fillRect(incX - 12, incY - 12, 24, 24);
    ctx.fillStyle = beamColor;
    ctx.beginPath();
    ctx.arc(incX, incY, 5, 0, Math.PI * 2);
    ctx.fill();

    // 2. Reflected Ray (From center to top right, angle = theta1)
    const refX = cx + rayLength * Math.sin(theta1Rad);
    const refY = cy - rayLength * Math.cos(theta1Rad);

    ctx.lineWidth = isTotalInternalReflection ? 4 : 2.5;
    ctx.strokeStyle = beamColor;
    ctx.shadowColor = beamGlow;
    ctx.shadowBlur = isTotalInternalReflection ? 14 : 6;

    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(refX, refY);
    ctx.stroke();

    // 3. Refracted Ray (Into medium 2)
    if (!isTotalInternalReflection) {
      const refrX = cx + rayLength * Math.sin(theta2Rad);
      const refrY = cy + rayLength * Math.cos(theta2Rad);

      ctx.lineWidth = 4;
      ctx.strokeStyle = beamColor;
      ctx.shadowColor = beamGlow;
      ctx.shadowBlur = 10;

      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(refrX, refrY);
      ctx.stroke();

      // Refraction angle arc
      ctx.shadowBlur = 0;
      ctx.beginPath();
      ctx.arc(cx, cy, 40, Math.PI / 2, Math.PI / 2 + theta2Rad, false);
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    // Incident angle arc
    ctx.shadowBlur = 0;
    ctx.beginPath();
    ctx.arc(cx, cy, 35, -Math.PI / 2 - theta1Rad, -Math.PI / 2, false);
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Center hit point
    ctx.fillStyle = '#FFE600';
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(cx, cy, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

  }, [incidentAngleDeg, medium1, medium2, laserColor, theta1Rad, theta2Rad, isTotalInternalReflection]);

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-neo-lime p-5 rounded-2xl neo-border shadow-brutal flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 bg-black text-white text-xs font-black rounded uppercase">
              중1 물리 · 빛과 파동
            </span>
            <h2 className="text-2xl font-black text-black">빛의 반사와 굴절 (스넬의 법칙 & 전반사 랩)</h2>
          </div>
          <p className="text-sm font-semibold text-black/80 mt-1">
            레이저의 입사각을 조절하며 반사의 법칙, 굴절각의 변화, 그리고 광통신의 기본 원리인 전반사를 관찰합니다.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setLaserColor(laserColor === 'green' ? 'red' : 'green')}
            className="neo-btn px-3 py-1.5 rounded-xl text-xs font-black bg-white text-black flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>레이저 색상: {laserColor === 'green' ? '초록 (532nm)' : '빨강 (650nm)'}</span>
          </button>
        </div>
      </div>

      {/* Main Simulation View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Ray Tracing Canvas */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-800 p-6 rounded-2xl neo-border shadow-brutal flex flex-col items-center justify-between min-h-[520px] relative">
          
          <div className="w-full flex items-center justify-between">
            <span className="text-xs font-black uppercase text-gray-500">
              광선 추적 시뮬레이터 (Ray Optics Trace)
            </span>
            {isTotalInternalReflection ? (
              <span className="text-xs font-black px-3 py-1 bg-neo-pink text-white rounded-lg border-2 border-black animate-bounce shadow-[2px_2px_0px_#000]">
                ⚡ 전반사 (Total Internal Reflection) 발생!
              </span>
            ) : (
              <span className="text-xs font-black px-2.5 py-1 bg-neo-green text-black rounded-lg border border-black">
                굴절광 진행 중
              </span>
            )}
          </div>

          {/* Interactive Canvas */}
          <div className="relative w-full max-w-lg h-96 my-3 rounded-xl border-3 border-black overflow-hidden shadow-[4px_4px_0px_#000]">
            
            {/* Medium 1 Label (Top) */}
            <div className="absolute top-3 left-4 px-2.5 py-1 bg-white/90 dark:bg-black/90 rounded border-2 border-black text-xs font-black z-10 shadow-[2px_2px_0px_#000]">
              매질 1: {medium1.name} (n₁ = {medium1.n})
            </div>

            {/* Medium 2 Label (Bottom) */}
            <div className="absolute bottom-3 left-4 px-2.5 py-1 bg-white/90 dark:bg-black/90 rounded border-2 border-black text-xs font-black z-10 shadow-[2px_2px_0px_#000]">
              매질 2: {medium2.name} (n₂ = {medium2.n})
            </div>

            <canvas
              ref={canvasRef}
              width={500}
              height={384}
              className="w-full h-full"
            />
          </div>

          {/* Angles Summary Banner */}
          <div className="w-full p-3 bg-slate-100 dark:bg-slate-900 rounded-xl border-2 border-black flex items-center justify-around text-xs font-black">
            <div>
              입사각 (θ₁): <span className="text-blue-600">{incidentAngleDeg}°</span>
            </div>
            <div>
              반사각 (θ_ref): <span className="text-amber-500">{incidentAngleDeg}°</span>
            </div>
            <div>
              굴절각 (θ₂):{' '}
              {isTotalInternalReflection ? (
                <span className="text-red-500 font-black">전반사로 없음</span>
              ) : (
                <span className="text-green-600">{refractedAngleDeg}°</span>
              )}
            </div>
          </div>

        </div>

        {/* Right: Controls & Presets */}
        <div className="lg:col-span-5 space-y-5">
          
          {/* Angle Slider */}
          <div className="p-5 bg-white dark:bg-slate-800 rounded-2xl neo-border shadow-brutal space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase text-gray-700 dark:text-gray-300">
                1. 레이저 입사각 조절 (Incident Angle)
              </span>
              <span className="text-lg font-black text-blue-600 bg-blue-50 dark:bg-slate-700 px-3 py-0.5 rounded-lg border border-black">
                {incidentAngleDeg}°
              </span>
            </div>

            <input
              type="range"
              min="0"
              max="85"
              step="1"
              value={incidentAngleDeg}
              onChange={(e) => setIncidentAngleDeg(Number(e.target.value))}
              className="w-full accent-black cursor-pointer"
            />

            <div className="flex justify-between text-[11px] font-bold text-gray-500">
              <span>0° (수직 입사)</span>
              <span>45°</span>
              <span>85° (완만한 입사)</span>
            </div>
          </div>

          {/* Medium 1 Selection (From) */}
          <div className="p-4 bg-white dark:bg-slate-800 rounded-2xl neo-border shadow-brutal space-y-2">
            <span className="text-xs font-black uppercase text-gray-700 dark:text-gray-300 block">
              2. 출발 매질 1 (Medium 1, n₁)
            </span>
            <div className="grid grid-cols-2 gap-2">
              {MEDIA.map((m) => (
                <button
                  key={'m1-' + m.id}
                  onClick={() => setMedium1(m)}
                  className={`p-2 rounded-xl border-2 border-black dark:border-white font-black text-xs text-left transition-all ${
                    medium1.id === m.id
                      ? 'bg-neo-cyan text-black shadow-[2px_2px_0px_#000] -translate-y-0.5'
                      : 'bg-gray-50 dark:bg-slate-700 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  <div>{m.name.split(' ')[0]}</div>
                  <div className="text-[10px] font-normal opacity-80">n = {m.n}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Medium 2 Selection (To) */}
          <div className="p-4 bg-white dark:bg-slate-800 rounded-2xl neo-border shadow-brutal space-y-2">
            <span className="text-xs font-black uppercase text-gray-700 dark:text-gray-300 block">
              3. 도착 매질 2 (Medium 2, n₂)
            </span>
            <div className="grid grid-cols-2 gap-2">
              {MEDIA.map((m) => (
                <button
                  key={'m2-' + m.id}
                  onClick={() => setMedium2(m)}
                  className={`p-2 rounded-xl border-2 border-black dark:border-white font-black text-xs text-left transition-all ${
                    medium2.id === m.id
                      ? 'bg-neo-yellow text-black shadow-[2px_2px_0px_#000] -translate-y-0.5'
                      : 'bg-gray-50 dark:bg-slate-700 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  <div>{m.name.split(' ')[0]}</div>
                  <div className="text-[10px] font-normal opacity-80">n = {m.n}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Optical Laws Card */}
          <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl neo-border shadow-brutal space-y-2 text-xs font-bold text-gray-700 dark:text-gray-300">
            <span className="font-black text-black dark:text-white block uppercase">
              💡 광학 핵심 공식 & 원리
            </span>
            <p>• <span className="text-amber-600 font-black">반사의 법칙:</span> 입사각 = 반사각 (항상 성립)</p>
            <p>• <span className="text-blue-600 font-black">스넬의 법칙:</span> n₁ sin(θ₁) = n₂ sin(θ₂)</p>
            <p>• <span className="text-red-500 font-black">전반사 조건:</span> n₁ &gt; n₂ (밀한 매질에서 소한 매질로 입사)이고, 입사각이 임계각(θc)보다 클 때 빛이 100% 반사됨 (광통신 케이블 원리)</p>
            {criticalAngleDeg && (
              <div className="p-2 bg-neo-pink/30 rounded border border-black font-black text-xs text-black dark:text-white">
                현재 조합 임계각 (θc): {criticalAngleDeg}°
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
};
