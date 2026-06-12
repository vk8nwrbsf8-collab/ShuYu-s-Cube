/**
 * App.jsx - 主入口
 *
 * 状态机：
 *   'landing' → 入场屏
 *   'I' / 'Navigate' / 'Foggy' / 'Journey' → 四个主页面
 *
 * 页面切换：淡入淡出（opacity transition）
 */
import { useState, useEffect } from 'react';
import LandingPage from './components/LandingPage';
import BottomNav   from './components/BottomNav';
import HomePage    from './pages/HomePage';
import NavigatePage from './pages/NavigatePage';
import FoggyPage   from './pages/FoggyPage';
import JourneyPage from './pages/JourneyPage';
import './index.css';

// 页面组件映射
const PAGE_MAP = {
  I:        HomePage,
  Navigate: NavigatePage,
  Foggy:    FoggyPage,
  Journey:  JourneyPage,
};

// ──────────────────────────────────────────────────────────
// 带淡入淡出的页面包装器
// ──────────────────────────────────────────────────────────
function PageWrapper({ pageKey }) {
  const [visible, setVisible]   = useState(false);
  const [rendered, setRendered] = useState(pageKey);

  // 初次挂载时淡入
  useEffect(() => {
    const raf = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  // pageKey 变更时：淡出 → 切换内容 → 淡入
  useEffect(() => {
    if (pageKey === rendered) return;
    setVisible(false);
    const t1 = setTimeout(() => {
      setRendered(pageKey);
      const t2 = setTimeout(() => setVisible(true), 40);
      return () => clearTimeout(t2);
    }, 320);
    return () => clearTimeout(t1);
  }, [pageKey]); // eslint-disable-line react-hooks/exhaustive-deps

  const CurrentPage = PAGE_MAP[rendered] || HomePage;

  return (
    <div
      className="w-full h-full"
      style={{
        opacity: visible ? 1 : 0,
        transition: 'opacity 0.35s ease',
        willChange: 'opacity',
      }}
    >
      <CurrentPage />
    </div>
  );
}

// ──────────────────────────────────────────────────────────
// 背景噪点纹理（增加手绘氛围）
// ──────────────────────────────────────────────────────────
function NoiseOverlay() {
  return (
    <div
      className="fixed inset-0 pointer-events-none z-0"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E")`,
        backgroundRepeat: 'repeat',
        backgroundSize: '128px 128px',
        mixBlendMode: 'overlay',
        opacity: 0.6,
      }}
    />
  );
}

// ──────────────────────────────────────────────────────────
// 全局 SVG 滤镜（所有页面共用）
// ──────────────────────────────────────────────────────────
function GlobalSVGFilters() {
  return (
    <svg width="0" height="0" className="absolute pointer-events-none" style={{ position: 'fixed' }}>
      <defs>
        {/* 手绘位移滤镜 */}
        <filter id="sketchy" x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence type="fractalNoise" baseFrequency="0.065 0.065" numOctaves="2" seed="5" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="1.5"
            xChannelSelector="R" yChannelSelector="G" />
        </filter>
        {/* 更强烈的手绘滤镜（入场屏用） */}
        <filter id="sketchy-strong" x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence type="fractalNoise" baseFrequency="0.04 0.04" numOctaves="3" seed="2" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="2.5"
            xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </defs>
    </svg>
  );
}

// ──────────────────────────────────────────────────────────
// App 主组件
// ──────────────────────────────────────────────────────────
export default function App() {
  const [phase, setPhase]     = useState('landing');  // 'landing' | 'main'
  const [current, setCurrent] = useState('I');

  const handleEnter = () => {
    setPhase('main');
  };

  const handleNavChange = (id) => {
    if (id === current) return;
    setCurrent(id);
  };

  return (
    <div className="fixed inset-0 bg-black overflow-hidden" style={{ fontFamily: "'Caveat', cursive" }}>
      {/* 背景噪点 */}
      <NoiseOverlay />

      {/* 全局 SVG 滤镜 */}
      <GlobalSVGFilters />

      {/* ── 入场屏 ── */}
      {phase === 'landing' && (
        <LandingPage onEnter={handleEnter} />
      )}

      {/* ── 主站内容 ── */}
      {phase === 'main' && (
        <>
          {/* 主内容区（留出底部导航高度） */}
          <div
            className="absolute inset-0"
            style={{ bottom: 72 }}
          >
            <PageWrapper pageKey={current} />
          </div>

          {/* 底部导航栏 */}
          <BottomNav current={current} onChange={handleNavChange} />

          {/* 页面标识（右下角极小文字） */}
          <div
            className="fixed right-5 bottom-[78px] pointer-events-none"
            style={{ fontFamily: "'Special Elite', monospace", fontSize: '0.58rem', letterSpacing: '0.18em', opacity: 0.15 }}
          >
            {current.toUpperCase()}
          </div>
        </>
      )}
    </div>
  );
}
