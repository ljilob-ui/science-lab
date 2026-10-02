import React, { useState, useEffect, useRef } from 'react';
import { Zap, AlertTriangle, ShieldCheck, Gauge, Lightbulb, RefreshCw } from 'lucide-react';

export const CircuitOhmLab: React.FC = () => {
  const [voltage, setVoltage] = useState<number>(9); // 1V ~ 24V
  const [resistance, setResistance] = useState<number>(10); // 1Ω ~ 100Ω
  const [circuitType, setCircuitType] = useState<'single' | 'series' | 'parallel'>('single');
  const [isSwitchClosed, setIsSwitchClosed] = useState<boolean>(true);
  const [isFuseBlown, setIsFuseBlown] = useState<boolean>(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Equivalent resistance calculation
  let equivalentResistance = resistance;
  if (circuitType === 'series') {
    equivalentResistance = resistance * 2;
  } else if (circuitType === 'parallel') {
    equivalentResistance = Number((resistance / 2).toFixed(2));
  }

  // Ohm's law: I = V / R
  const current = isSwitchClosed && !isFuseBlown ? Number((voltage / equivalentResistance).toFixed(2)) : 0;
  const power = Number((voltage * current).toFixed(2)); // Watts

  // Fuse threshold
  const maxSafeCurrent = 4.0; // 4A fuse

  useEffect(() => {
    if (current > maxSafeCurrent && !isFuseBlown) {
      setIsFuseBlown(true);
    }
  }, [current, isFuseBlown]);

  // Bulb brightness (0% ~ 100%)
  const brightness = Math.min(100, Math.round((power / 30) * 100));

  // Canvas electron flow animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let offset = 0;

    // Rectangle circuit dimensions
    const x = 40;
    const y = 40;
    const w = canvas.width - 80;
    const h = canvas.height - 80;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw wire
      ctx.lineWidth = 6;
      ctx.strokeStyle = '#000000';
      ctx.strokeRect(x, y, w, h);

      // Inner wire color
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#FF7A00'; // Copper wire
      ctx.strokeRect(x, y, w, h);

      // Draw electrons if current flows
      if (isSwitchClosed && !isFuseBlown && current > 0) {
        offset = (offset + current * 1.5) % 40;
        const perimeter = 2 * (w + h);
        const count = 30;

        for (let i = 0; i < count; i++) {
          const dist = (i * (perimeter / count) + offset) % perimeter;
          let px = 0;
          let py = 0;

          if (dist < w) {
            // Top wire (left to right)
            px = x + dist;
            py = y;
          } else if (dist < w + h) {
            // Right wire (top to bottom)
            px = x + w;
            py = y + (dist - w);
          } else if (dist < 2 * w + h) {
            // Bottom wire (right to left)
            px = x + w - (dist - (w + h));
            py = y + h;
          } else {
            // Left wire (bottom to top)
            px = x;
            py = y + h - (dist - (2 * w + h));
          }

          // Draw electron (blue dot with negative sign)
          ctx.beginPath();
          ctx.arc(px, py, 6, 0, Math.PI * 2);
          ctx.fillStyle = '#00F0FF';
          ctx.fill();
          ctx.lineWidth = 1.5;
          ctx.strokeStyle = '#000000';
          ctx.stroke();

          ctx.fillStyle = '#000000';
          ctx.font = 'bold 9px sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('-', px, py);
        }
      }

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [isSwitchClosed, isFuseBlown, current]);

  const handleResetFuse = () => {
    setIsFuseBlown(false);
    setVoltage(9);
    setResistance(10);
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-neo-yellow p-5 rounded-2xl neo-border shadow-brutal flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 bg-black text-white text-xs font-black rounded uppercase">
              중2 물리 · 전기와 자기
            </span>
            <h2 className="text-2xl font-black text-black">옴의 법칙 & 전기 회로 가상 워크벤치</h2>
          </div>
          <p className="text-sm font-semibold text-black/80 mt-1">
            전압(V)과 저항(R)을 조절하며 전류(I = V/R), 전구 밝기, 전자 흐름 속도 및 직렬·병렬 연결을 탐구합니다.
          </p>
        </div>

        <button
          onClick={() => setIsSwitchClosed(!isSwitchClosed)}
          className={`neo-btn px-4 py-2 rounded-xl text-sm font-black flex items-center gap-2 ${
            isSwitchClosed ? 'bg-red-400 text-white' : 'bg-neo-green text-black'
          }`}
        >
          <Zap className="w-4 h-4 fill-current" />
          <span>{isSwitchClosed ? '전원 스위치 열기 (OFF)' : '전원 스위치 닫기 (ON)'}</span>
        </button>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Interactive Circuit Workbench Canvas */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-800 p-6 rounded-2xl neo-border shadow-brutal flex flex-col items-center justify-between min-h-[520px] relative">
          
          <div className="flex items-center justify-between w-full">
            <span className="text-xs font-black uppercase text-gray-500">
              실시간 회로 시뮬레이터 (전자 e⁻ 흐름 애니메이션)
            </span>
            {isFuseBlown ? (
              <span className="flex items-center gap-1 text-xs font-black px-2.5 py-1 bg-red-500 text-white rounded border border-black animate-pulse">
                <AlertTriangle className="w-3.5 h-3.5" /> 퓨즈 단선 (과전류 차단)
              </span>
            ) : (
              <span className="flex items-center gap-1 text-xs font-black px-2.5 py-1 bg-green-400 text-black rounded border border-black">
                <ShieldCheck className="w-3.5 h-3.5" /> 안전 정상 작동
              </span>
            )}
          </div>

          {/* Circuit Visual Box */}
          <div className="relative w-full max-w-md h-72 my-4 flex items-center justify-center">
            
            {/* Background Canvas for Wire & Electrons */}
            <canvas 
              ref={canvasRef} 
              width={420} 
              height={280} 
              className="absolute inset-0 w-full h-full pointer-events-none"
            />

            {/* Circuit Components Placed on Wire Perimeter */}
            
            {/* Top Wire Component: Resistor(s) */}
            <div className="absolute top-4 bg-white dark:bg-slate-900 border-2 border-black rounded-lg px-3 py-1.5 shadow-[2px_2px_0px_#000] text-center z-10">
              <span className="text-[10px] font-black uppercase block text-gray-500">
                {circuitType === 'single' ? '저항 (R)' : circuitType === 'series' ? '직렬 저항 (R1+R2)' : '병렬 저항 (R1||R2)'}
              </span>
              <span className="text-sm font-black text-amber-600">
                합성저항: {equivalentResistance} Ω
              </span>
            </div>

            {/* Bottom Wire Component: DC Battery */}
            <div className="absolute bottom-4 bg-white dark:bg-slate-900 border-2 border-black rounded-lg px-3 py-1.5 shadow-[2px_2px_0px_#000] text-center z-10 flex items-center gap-2">
              <span className="text-sm font-black bg-neo-yellow px-1 rounded border border-black">+</span>
              <div>
                <span className="text-[10px] font-black uppercase block text-gray-500">직류 전원</span>
                <span className="text-sm font-black text-blue-600">{voltage} V</span>
              </div>
              <span className="text-sm font-black bg-gray-300 px-1.5 rounded border border-black">-</span>
            </div>

            {/* Left Wire Component: Fuse */}
            <div className={`absolute left-2 -translate-y-4 border-2 border-black rounded-lg px-2 py-1 text-center z-10 ${
              isFuseBlown ? 'bg-red-400 text-white' : 'bg-gray-100 dark:bg-slate-700'
            }`}>
              <span className="text-[9px] font-black block">안전 퓨즈</span>
              <span className="text-[10px] font-black">{isFuseBlown ? '단선됨' : '4A 한계'}</span>
            </div>

            {/* Right Wire Component: Light Bulb with Glow effect */}
            <div className="absolute right-2 -translate-y-4 flex flex-col items-center z-10">
              <div 
                className="w-14 h-14 rounded-full border-3 border-black flex items-center justify-center transition-all duration-300 shadow-[2px_2px_0px_#000]"
                style={{
                  backgroundColor: isSwitchClosed && !isFuseBlown && brightness > 0 
                    ? `rgba(255, 230, 0, ${Math.max(0.2, brightness / 100)})` 
                    : '#e2e8f0',
                  boxShadow: isSwitchClosed && !isFuseBlown && brightness > 10 
                    ? `0 0 ${brightness * 0.4}px rgba(255, 200, 0, 0.9)` 
                    : '2px 2px 0px #000'
                }}
              >
                <Lightbulb className={`w-8 h-8 ${brightness > 0 && isSwitchClosed && !isFuseBlown ? 'text-amber-500 fill-yellow-300 animate-pulse' : 'text-gray-400'}`} />
              </div>
              <span className="text-[10px] font-black mt-1 bg-white dark:bg-black px-1.5 rounded border border-black">
                밝기 {brightness}%
              </span>
            </div>

          </div>

          {/* Bottom Formula Banner */}
          <div className="w-full p-3 bg-neo-yellow/30 rounded-xl border-2 border-black font-black text-xs sm:text-sm text-center">
            옴의 법칙: <span className="text-blue-600">I (전류 {current} A)</span> = <span className="text-red-500">V (전압 {voltage} V)</span> ÷ <span className="text-amber-600">R (합성저항 {equivalentResistance} Ω)</span>
          </div>

        </div>

        {/* Right: Sensors & Interactive Controls */}
        <div className="lg:col-span-5 space-y-5">
          
          {/* Digital Sensor Gauges */}
          <div className="grid grid-cols-2 gap-3">
            
            {/* Ammeter (전류계) */}
            <div className="p-4 bg-neo-cyan/20 dark:bg-slate-800 rounded-2xl neo-border shadow-brutal flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase text-gray-700 dark:text-gray-300">전류계 (Ammeter)</span>
                <Gauge className="w-4 h-4 text-cyan-600" />
              </div>
              <div className="my-2 text-center">
                <div className="text-3xl font-black text-cyan-600 tracking-tight">
                  {current} A
                </div>
                <div className="text-[11px] font-bold text-gray-500">
                  ({(current * 1000).toFixed(0)} mA)
                </div>
              </div>
            </div>

            {/* Voltmeter & Power */}
            <div className="p-4 bg-neo-pink/20 dark:bg-slate-800 rounded-2xl neo-border shadow-brutal flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase text-gray-700 dark:text-gray-300">소비 전력 (Power)</span>
                <Zap className="w-4 h-4 text-pink-600" />
              </div>
              <div className="my-2 text-center">
                <div className="text-3xl font-black text-pink-600 tracking-tight">
                  {power} W
                </div>
                <div className="text-[11px] font-bold text-gray-500">
                  (P = V × I)
                </div>
              </div>
            </div>

          </div>

          {/* Circuit Connection Type Selector */}
          <div className="p-4 bg-white dark:bg-slate-800 rounded-2xl neo-border shadow-brutal space-y-3">
            <span className="text-xs font-black uppercase text-gray-700 dark:text-gray-300 block">
              1. 회로 연결 방식 (Circuit Configuration)
            </span>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'single' as const, name: '단일 저항', desc: 'R' },
                { id: 'series' as const, name: '직렬 연결', desc: 'R1 + R2' },
                { id: 'parallel' as const, name: '병렬 연결', desc: 'R/2' },
              ].map((c) => (
                <button
                  key={c.id}
                  onClick={() => setCircuitType(c.id)}
                  className={`p-2 rounded-xl border-2 border-black dark:border-white font-black text-xs text-center transition-all ${
                    circuitType === c.id
                      ? 'bg-neo-yellow text-black shadow-[2px_2px_0px_#000] -translate-y-0.5'
                      : 'bg-gray-50 dark:bg-slate-700 text-gray-600 dark:text-gray-300'
                  }`}
                >
                  <div>{c.name}</div>
                  <div className="text-[10px] font-normal opacity-70 mt-0.5">{c.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Voltage & Resistance Sliders */}
          <div className="p-5 bg-white dark:bg-slate-800 rounded-2xl neo-border shadow-brutal space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase text-gray-700 dark:text-gray-300">
                2. 전압 및 저항 제어
              </span>
              {isFuseBlown && (
                <button
                  onClick={handleResetFuse}
                  className="flex items-center gap-1 text-xs font-black px-2.5 py-1 bg-red-400 text-white rounded-lg border border-black shadow-[2px_2px_0px_#000]"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>퓨즈 교체</span>
                </button>
              )}
            </div>

            {/* Voltage slider */}
            <div>
              <div className="flex justify-between text-xs font-black mb-1">
                <span>전원 전압 (Voltage, V):</span>
                <span className="text-blue-600">{voltage} V</span>
              </div>
              <input
                type="range"
                min="1"
                max="24"
                step="0.5"
                value={voltage}
                onChange={(e) => setVoltage(Number(e.target.value))}
                className="w-full accent-black cursor-pointer"
              />
            </div>

            {/* Resistance slider */}
            <div>
              <div className="flex justify-between text-xs font-black mb-1">
                <span>단위 저항값 (Resistance, R):</span>
                <span className="text-amber-600">{resistance} Ω</span>
              </div>
              <input
                type="range"
                min="2"
                max="100"
                step="1"
                value={resistance}
                onChange={(e) => setResistance(Number(e.target.value))}
                className="w-full accent-black cursor-pointer"
              />
            </div>
          </div>

          {/* Educational Summary */}
          <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl neo-border shadow-brutal space-y-2 text-xs font-bold text-gray-700 dark:text-gray-300">
            <span className="font-black text-black dark:text-white block uppercase">
              📌 중학교 핵심 탐구 요점
            </span>
            <p>• 저항이 일정할 때: 전압(V)이 커질수록 전류(I)도 비례하여 증가합니다.</p>
            <p>• 전압이 일정할 때: 저항(R)이 커질수록 전류(I)는 반비례하여 감소합니다.</p>
            <p>• 병렬 연결 시: 전체 저항이 작아져 더 센 전류가 흐릅니다.</p>
          </div>

        </div>

      </div>

    </div>
  );
};
