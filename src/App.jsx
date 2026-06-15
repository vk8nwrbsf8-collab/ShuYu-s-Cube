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
import LandingPage  from './components/LandingPage';
import BottomNav    from './components/BottomNav';
import HomePage     from './pages/HomePage';
import NavigatePage from './pages/NavigatePage';
import FoggyPage    from './pages/FoggyPage';
import JourneyPage  from './pages/JourneyPage';
import { PlayerProvider, usePlayer, fmtTime } from './context/PlayerContext';
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
function PageWrapper({ pageKey, openMusicSub, onMusicSubOpened, resetSignal }) {
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
      {rendered === 'Foggy'
        ? <CurrentPage openMusicSub={openMusicSub} onMusicSubOpened={onMusicSubOpened} resetSignal={resetSignal} />
        : rendered === 'Journey'
          ? <CurrentPage resetSignal={resetSignal} />
          : <CurrentPage />
      }
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
// 全局底部播放器条（只在 Foggy 页显示，在 BottomNav 上方）
// ──────────────────────────────────────────────────────────
function GlobalPlayerBar() {
  const { playingTrack, isPlaying, setIsPlaying, progress, duration, currentTime, loading, errMsg, playNext, playPrev, seekTo, foggySubPage } = usePlayer();

  // 只在 Music 子页且有歌曲播放时才显示
  if (!playingTrack || foggySubPage !== 'music') return null;

  const isMobile = typeof window !== 'undefined' && window.innerWidth <= 640;
  // BottomNav 高度约 64px
  return (
    <div
      style={{
        position: 'fixed',
        bottom: isMobile ? 60 : 72,
        left: 0,
        right: 0,
        height: isMobile ? 56 : 64,
        background: 'rgba(8,8,8,0.96)',
        borderTop: '1px solid rgba(255,255,255,0.07)',
        backdropFilter: 'blur(20px)',
        display: 'flex',
        alignItems: 'center',
        padding: isMobile ? '0 12px' : '0 24px',
        gap: isMobile ? 8 : 14,
        zIndex: 45,
      }}
    >
      {/* 封面 */}
      <div style={{ width: 38, height: 38, borderRadius: 3, overflow: 'hidden', flexShrink: 0, border: '1px solid rgba(255,255,255,0.1)' }}>
        <img src={playingTrack.cover} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </div>

      {/* 曲目信息 */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontFamily: "'Caveat', cursive", fontSize: '0.88rem', fontWeight: 700, opacity: 0.9, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {playingTrack.name}
          {errMsg && <span style={{ marginLeft: 8, fontSize: '0.65rem', color: '#ff6b6b', opacity: 0.7 }}>{errMsg}</span>}
        </p>
        <p style={{ fontFamily: "'Caveat', cursive", fontSize: '0.72rem', opacity: 0.38, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {playingTrack.albumTitle}
        </p>
      </div>

      {/* 进度 + 时间（移动端隐藏） */}
      {!isMobile && (
        <div style={{ flex: 2, display: 'flex', alignItems: 'center', gap: 7, minWidth: 0 }}>
          <span style={{ fontFamily: "'Special Elite', monospace", fontSize: '0.58rem', opacity: 0.38, flexShrink: 0 }}>{fmtTime(currentTime)}</span>
          <div
            style={{ flex: 1, height: 2, background: 'rgba(255,255,255,0.1)', borderRadius: 1, cursor: 'pointer' }}
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              seekTo((e.clientX - rect.left) / rect.width);
            }}
          >
            <div style={{ width: `${progress * 100}%`, height: '100%', background: 'rgba(255,255,255,0.65)', borderRadius: 1 }} />
          </div>
          <span style={{ fontFamily: "'Special Elite', monospace", fontSize: '0.58rem', opacity: 0.38, flexShrink: 0 }}>{fmtTime(duration)}</span>
        </div>
      )}

      {/* 控制按钮 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? 10 : 14, flexShrink: 0 }}>
        <button onClick={playPrev} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', opacity: 0.45, padding: 3 }}>
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
            <polygon points="14,2 14,14 6,8" fill="white" />
            <rect x="2" y="2" width="2.5" height="12" rx="1" fill="white" />
          </svg>
        </button>
        <button
          onClick={() => { if (!loading) setIsPlaying(p => !p); }}
          style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.18)', borderRadius: '50%', color: 'white', cursor: loading ? 'wait' : 'pointer', width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          {loading
            ? <svg width="12" height="12" viewBox="0 0 14 14" style={{ animation: 'spin 1s linear infinite' }}><circle cx="7" cy="7" r="5" stroke="white" strokeWidth="1.5" fill="none" strokeDasharray="20" strokeDashoffset="5" /></svg>
            : isPlaying
              ? <svg width="10" height="12" viewBox="0 0 12 14" fill="none"><rect x="1" y="1" width="3.5" height="12" rx="1" fill="white" /><rect x="7.5" y="1" width="3.5" height="12" rx="1" fill="white" /></svg>
              : <svg width="10" height="12" viewBox="0 0 12 14" fill="none"><polygon points="1,1 1,13 12,7" fill="white" /></svg>
          }
        </button>
        <button onClick={playNext} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', opacity: 0.45, padding: 3 }}>
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
            <polygon points="2,2 2,14 10,8" fill="white" />
            <rect x="11.5" y="2" width="2.5" height="12" rx="1" fill="white" />
          </svg>
        </button>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────
// 迷你播放器（右上角，任何页面有播放时都显示，点封面跳 Music 子页）
// ──────────────────────────────────────────────────────────
function MiniPlayer({ onNavigateToMusic }) {
  const { playingTrack, isPlaying, setIsPlaying, loading } = usePlayer();

  // 有播放时就显示（任何页面）
  if (!playingTrack) return null;

  const isMobile = typeof window !== 'undefined' && window.innerWidth <= 640;

  return (
    <div
      style={{
        position: 'fixed',
        top: isMobile ? 12 : 20,
        right: isMobile ? 12 : 20,
        zIndex: 50,
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        background: 'rgba(10,10,10,0.92)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: 8,
        padding: isMobile ? '6px 10px 6px 6px' : '8px 12px 8px 8px',
        backdropFilter: 'blur(20px)',
        boxShadow: '0 4px 24px rgba(0,0,0,0.5)',
        cursor: 'default',
        maxWidth: isMobile ? 180 : 240,
      }}
    >
      {/* 点击封面跳到 Music 子页 */}
      <button
        onClick={onNavigateToMusic}
        style={{
          background: 'none', border: 'none', padding: 0, cursor: 'pointer', flexShrink: 0,
        }}
        title="回到 Music"
      >
        <div style={{ width: 36, height: 36, borderRadius: 4, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.12)' }}>
          <img
            src={playingTrack.cover}
            alt=""
            style={{
              width: '100%', height: '100%', objectFit: 'cover',
              animation: isPlaying ? 'spin 8s linear infinite' : 'none',
              borderRadius: 4,
            }}
          />
        </div>
      </button>

      {/* 曲名 */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{
          fontFamily: "'Caveat', cursive", fontSize: '0.82rem', fontWeight: 700,
          opacity: 0.9, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          color: 'white',
        }}>
          {playingTrack.name}
        </p>
        <p style={{ fontFamily: "'Caveat', cursive", fontSize: '0.65rem', opacity: 0.4, color: 'white', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {playingTrack.albumTitle}
        </p>
      </div>

      {/* 播放/暂停 */}
      <button
        onClick={() => { if (!loading) setIsPlaying(p => !p); }}
        style={{
          background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)',
          borderRadius: '50%', color: 'white', cursor: loading ? 'wait' : 'pointer',
          width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        {loading
          ? <svg width="10" height="10" viewBox="0 0 14 14" style={{ animation: 'spin 1s linear infinite' }}><circle cx="7" cy="7" r="5" stroke="white" strokeWidth="1.5" fill="none" strokeDasharray="20" strokeDashoffset="5" /></svg>
          : isPlaying
            ? <svg width="8" height="10" viewBox="0 0 12 14" fill="none"><rect x="1" y="1" width="3.5" height="12" rx="1" fill="white" /><rect x="7.5" y="1" width="3.5" height="12" rx="1" fill="white" /></svg>
            : <svg width="8" height="10" viewBox="0 0 12 14" fill="none"><polygon points="1,1 1,13 12,7" fill="white" /></svg>
        }
      </button>
    </div>
  );
}

// ──────────────────────────────────────────────────────────
// App 主组件
// ──────────────────────────────────────────────────────────
function AppInner() {
  const [phase, setPhase]     = useState('landing');  // 'landing' | 'main'
  const [current, setCurrent] = useState('I');

  const handleEnter = () => setPhase('main');

  const [resetSignal, setResetSignal] = useState(0);

  const handleNavChange = (id) => {
    if (id === current) {
      // 点击当前页的导航按钉：重置子页回目录
      setResetSignal(s => s + 1);
      return;
    }
    setCurrent(id);
  };

  // 迷你播放器封面点击 → 跳到 Foggy 页 + 将 openMusicSub 标记为 true
  const [openMusicSub, setOpenMusicSub] = useState(false);

  const handleMiniPlayerClick = () => {
    setOpenMusicSub(true);
    setCurrent('Foggy');
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
          {/* 主内容区（占满全屏） */}
          <div className="absolute inset-0">
            <PageWrapper pageKey={current} openMusicSub={openMusicSub} onMusicSubOpened={() => setOpenMusicSub(false)} resetSignal={resetSignal} />
          </div>

          {/* 迷你播放器（右上角，任何页面有播放时显示） */}
          <MiniPlayer onNavigateToMusic={handleMiniPlayerClick} />

          {/* 全局播放器条（只在 Music 子页显示） */}
          <GlobalPlayerBar />

          {/* 底部导航栏 */}
          <BottomNav current={current} onChange={handleNavChange} />
        </>
      )}
    </div>
  );
}

export default function App() {
  return (
    <PlayerProvider>
      <AppInner />
    </PlayerProvider>
  );
}
