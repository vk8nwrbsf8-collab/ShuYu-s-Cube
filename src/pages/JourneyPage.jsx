/**
 * JourneyPage - 【Journey】旅行地图
 *
 * 主界面：2行 × 3列 的网格矩阵，6 个手绘图标 + 地名
 * 点击进入详情子页（左固定文字 + 右瀑布流照片墙）
 */
import { useState, useEffect, useRef, useCallback } from 'react';
import { destinations } from '../data/journey';

// ──────────────────────────────────────────────────────────
// 手绘图标 SVG 合集
// ──────────────────────────────────────────────────────────

// 羊肉串
function MuttonIcon() {
  return (
    <svg width="72" height="72" viewBox="0 0 72 72" fill="none" className="jitter-svg" style={{ filter: 'url(#sketchy)' }}>
      {/* 签子 */}
      <line x1="36" y1="6" x2="36" y2="66" stroke="white" strokeWidth="2.2" strokeLinecap="round" />
      {/* 三块肉 */}
      <rect x="24" y="14" width="24" height="14" rx="5" stroke="white" strokeWidth="2" fill="none" />
      <rect x="26" y="32" width="20" height="12" rx="4" stroke="white" strokeWidth="2" fill="none" />
      <rect x="24" y="48" width="24" height="13" rx="5" stroke="white" strokeWidth="2" fill="none" />
      {/* 内部纹路 */}
      <line x1="30" y1="17" x2="42" y2="17" stroke="white" strokeWidth="0.8" style={{ opacity: 0.3 }} />
      <line x1="30" y1="35" x2="42" y2="35" stroke="white" strokeWidth="0.8" style={{ opacity: 0.3 }} />
      <line x1="30" y1="51" x2="42" y2="51" stroke="white" strokeWidth="0.8" style={{ opacity: 0.3 }} />
    </svg>
  );
}

// 富士山
function FujiIcon() {
  return (
    <svg width="72" height="72" viewBox="0 0 72 72" fill="none" className="jitter-svg" style={{ filter: 'url(#sketchy)' }}>
      {/* 山体外轮廓：两斜边 + 宽底 */}
      <path d="M4,60 L32,14 L36,8 L40,14 L68,60 Z"
        stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      {/* 雪盖：贴合山体斜边，占上半部，白色填充 */}
      <path d="M18,34 Q27,10 36,8 Q45,10 54,34 L50,34 L46,36 L42,34 L38,36 L36,34 L34,36 L30,34 L26,36 L22,34 Z"
        stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="white" />
      {/* 雪盖底边左侧短锯齿（冰川） */}
      <path d="M18,34 L14,38 L12,36" stroke="white" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      {/* 雪盖底边右侧短锯齿（冰川） */}
      <path d="M54,34 L58,38 L60,36" stroke="white" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
}

// 汤咖喱
function CurryIcon() {
  return (
    <svg width="72" height="72" viewBox="0 0 72 72" fill="none" className="jitter-svg" style={{ filter: 'url(#sketchy)' }}>
      {/* 碗体 */}
      <path d="M14,38 Q14,58 36,58 Q58,58 58,38 Z"
        stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      {/* 碗口 */}
      <ellipse cx="36" cy="38" rx="22" ry="7" stroke="white" strokeWidth="2" fill="none" />
      {/* 汤面纹路 */}
      <path d="M24,38 Q30,35 36,38 Q42,41 48,38" stroke="white" strokeWidth="1.2" strokeLinecap="round" fill="none" style={{ opacity: 0.45 }} />
      {/* 热气 */}
      <path d="M28,28 Q26,22 28,16 Q30,22 28,28" stroke="white" strokeWidth="1.5" strokeLinecap="round" fill="none" style={{ opacity: 0.5 }} />
      <path d="M36,24 Q34,18 36,12 Q38,18 36,24" stroke="white" strokeWidth="1.5" strokeLinecap="round" fill="none" style={{ opacity: 0.5 }} />
      <path d="M44,28 Q42,22 44,16 Q46,22 44,28" stroke="white" strokeWidth="1.5" strokeLinecap="round" fill="none" style={{ opacity: 0.5 }} />
    </svg>
  );
}

// 苏州枫叶（像 🍁）
function MapleIcon() {
  return (
    <svg width="72" height="72" viewBox="0 0 72 72" fill="none" className="jitter-svg" style={{ filter: 'url(#sketchy)' }}>
      {/*
        5裂枫叶：顶叶朝上，左右各2片侧叶，底部茎
        用连续路径勾勒整体外轮廓
      */}
      {/*
        5裂枫叶：顶部1片，左右各2片，底部平整
        从顶叶尖(36,6)顺时针绕一圈
        叶尖用 L，叶谷（叶片之间的凹陷）也用 L
      */}
      <path
        d="
          M36,6
          L32,20 L20,14 L26,26
          L8,28 L20,34
          L14,48 L30,42
          L30,52 L36,52 L42,52
          L42,42 L58,48
          L52,34 L64,28
          L46,26 L52,14
          L40,20
          Z
        "
        stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"
      />
      {/* 茎 */}
      <line x1="36" y1="52" x2="36" y2="66" stroke="white" strokeWidth="2.2" strokeLinecap="round" />
      {/* 主叶脉：茎顶→叶顶 */}
      <line x1="36" y1="52" x2="36" y2="12" stroke="white" strokeWidth="0.9" strokeLinecap="round" style={{ opacity: 0.4 }} />
      {/* 左上侧脉：中心→左上叶尖 */}
      <line x1="36" y1="36" x2="20" y2="14" stroke="white" strokeWidth="0.8" strokeLinecap="round" style={{ opacity: 0.32 }} />
      {/* 右上侧脉：中心→右上叶尖 */}
      <line x1="36" y1="36" x2="52" y2="14" stroke="white" strokeWidth="0.8" strokeLinecap="round" style={{ opacity: 0.32 }} />
      {/* 左下侧脉：中心→左下叶尖 */}
      <line x1="36" y1="42" x2="14" y2="48" stroke="white" strokeWidth="0.7" strokeLinecap="round" style={{ opacity: 0.28 }} />
      {/* 右下侧脉：中心→右下叶尖 */}
      <line x1="36" y1="42" x2="58" y2="48" stroke="white" strokeWidth="0.7" strokeLinecap="round" style={{ opacity: 0.28 }} />
    </svg>
  );
}

// 炸鸡腿
function ChickenIcon() {
  return (
    <svg width="72" height="72" viewBox="0 0 72 72" fill="none" className="jitter-svg" style={{ filter: 'url(#sketchy)' }}>
      {/* 肉体：上方大椭圆 */}
      <ellipse cx="28" cy="26" rx="20" ry="22"
        stroke="white" strokeWidth="2.2" fill="none" />
      {/* 骨头柄：细线斜向右下 */}
      <line x1="42" y1="42" x2="60" y2="60" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
      {/* 骨头末端小圆 */}
      <circle cx="62" cy="62" r="4" stroke="white" strokeWidth="2" fill="none" />
    </svg>
  );
}

// 啤酒杯
function BeerIcon() {
  return (
    <svg width="72" height="72" viewBox="0 0 72 72" fill="none" className="jitter-svg" style={{ filter: 'url(#sketchy)' }}>
      {/* 杯身 */}
      <path d="M20,22 L22,64 L50,64 L52,22 Z"
        stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      {/* 杯口 */}
      <line x1="20" y1="22" x2="52" y2="22" stroke="white" strokeWidth="2.2" strokeLinecap="round" />
      {/* 把手 */}
      <path d="M52,30 Q64,32 64,44 Q64,56 52,54"
        stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      {/* 泡沫 */}
      <path d="M20,22 Q24,14 28,22 Q30,15 34,22 Q36,14 40,22 Q42,15 46,22 Q48,14 52,22"
        stroke="white" strokeWidth="1.8" strokeLinecap="round" fill="none" style={{ opacity: 0.9 }} />
      {/* 液体线（气泡） */}
      <line x1="30" y1="40" x2="30" y2="46" stroke="white" strokeWidth="0.8" strokeLinecap="round" style={{ opacity: 0.4 }} />
      <line x1="38" y1="36" x2="38" y2="44" stroke="white" strokeWidth="0.8" strokeLinecap="round" style={{ opacity: 0.4 }} />
      <line x1="43" y1="42" x2="43" y2="50" stroke="white" strokeWidth="0.8" strokeLinecap="round" style={{ opacity: 0.35 }} />
    </svg>
  );
}

const ICON_MAP = {
  mutton:  MuttonIcon,
  fuji:    FujiIcon,
  curry:   CurryIcon,
  maple:   MapleIcon,
  chicken: ChickenIcon,
  beer:    BeerIcon,
};

// ──────────────────────────────────────────────────────────
// 返回按钮
// ──────────────────────────────────────────────────────────
function BackButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 bg-transparent border-none cursor-pointer group mb-6"
    >
      <svg
        width="32" height="20" viewBox="0 0 32 20" fill="none"
        className="jitter-svg group-hover:opacity-70 transition-opacity"
        style={{ filter: 'url(#sketchy)' }}
      >
        <path d="M30,10 L4,10" stroke="white" strokeWidth="2.2" strokeLinecap="round" />
        <path d="M10,4 L3,10 L10,16" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </svg>
      <span
        className="jitter-text group-hover:opacity-70 transition-opacity"
        style={{ fontFamily: "'Caveat', cursive", fontSize: '1rem', opacity: 0.6, color: '#FFF' }}
      >
        返回
      </span>
    </button>
  );
}

// ──────────────────────────────────────────────────────────
// 单个 Day 的双列瀑布流
// ──────────────────────────────────────────────────────────
function DayMasonry({ day, dayIdx, dayRef }) {
  const col0 = [];
  const col1 = [];

  if (day.photos.length === 0) {
    // 无图时展示占位
    return (
      <div
        ref={dayRef}
        style={{
          marginBottom: 24,
          border: '1px dashed rgba(255,255,255,0.12)',
          borderRadius: 3,
          height: 80,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <p style={{ fontFamily: "'Caveat', cursive", fontSize: '0.75rem', opacity: 0.2 }}>照片待添加</p>
      </div>
    );
  }

  day.photos.forEach((src, pi) => {
    if (pi % 2 === 0) col0.push({ src, pi });
    else col1.push({ src, pi });
  });

  const renderPhoto = (src, pi, isFirst, ref) => (
    <div
      key={`${dayIdx}-${pi}`}
      ref={isFirst ? ref : null}
      style={{ marginBottom: 8, borderRadius: 3, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.07)' }}
    >
      <img
        src={src}
        alt=""
        style={{ width: '100%', display: 'block', objectFit: 'cover' }}
        loading="lazy"
      />
    </div>
  );

  return (
    <div ref={day.photos.length > 0 ? dayRef : null} style={{ marginBottom: 20 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 8px', alignItems: 'start' }}>
        <div>
          {col0.map(({ src, pi }) => renderPhoto(src, pi, pi === 0, dayRef))}
        </div>
        <div style={{ marginTop: 20 }}>
          {col1.map(({ src, pi }) => renderPhoto(src, pi, false, null))}
        </div>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────
// 全部 days 的瀑布流（带日期标题分隔）
// ──────────────────────────────────────────────────────────
function MasonryWall({ days, dayRefs }) {
  return (
    <div>
      {days.map((day, di) => (
        <div key={di}>
          {/* 日期标题（锚点，供时间线跳转） */}
          <div
            ref={(el) => { if (dayRefs) dayRefs.current[di] = el; }}
            style={{ marginBottom: 10, paddingTop: di > 0 ? 8 : 0 }}
          >
            <span style={{
              fontFamily: "'Special Elite', monospace",
              fontSize: '0.58rem',
              letterSpacing: '0.14em',
              opacity: 0.35,
              marginRight: 8,
            }}>{day.date}</span>
            <span style={{
              fontFamily: "'Caveat', cursive",
              fontSize: '0.82rem',
              opacity: 0.55,
            }}>{day.label}</span>
          </div>
          <DayMasonry day={day} dayIdx={di} dayRef={null} />
        </div>
      ))}
    </div>
  );
}

// ──────────────────────────────────────────────────────────
// 详情页：左侧时间线 + 右侧双列瀑布流
// ──────────────────────────────────────────────────────────
function DestinationDetail({ dest, onBack }) {
  const [activeDay, setActiveDay] = useState(0);
  const scrollRef = useRef(null);
  const dayRefs = useRef([]);

  const scrollToDay = useCallback((idx) => {
    setActiveDay(idx);
    const el = dayRefs.current[idx];
    const container = scrollRef.current;
    if (el && container) {
      container.scrollTo({ top: el.offsetTop - 12, behavior: 'smooth' });
    }
  }, []);

  return (
    <div className="w-full h-full flex flex-col" style={{ padding: '32px 52px 72px' }}>
      <BackButton onClick={onBack} />

      <div className="flex flex-1 gap-8 overflow-hidden" style={{ minHeight: 0 }}>

        {/* ── 左侧：地名 + 时间线 ── */}
        <div
          style={{
            width: 140, flexShrink: 0, display: 'flex', flexDirection: 'column',
            overflowY: 'auto', paddingRight: 8,
          }}
        >
          {/* 地名 */}
          <h2
            className="jitter-text"
            style={{ fontFamily: "'Caveat', cursive", fontSize: '2.2rem', fontWeight: 700, lineHeight: 1, marginBottom: 4 }}
          >
            {dest.name}
          </h2>
          <p style={{ fontFamily: "'Special Elite', monospace", fontSize: '0.62rem', letterSpacing: '0.13em', opacity: 0.35, marginBottom: 20 }}>
            {dest.time}
          </p>

          {/* 时间线 */}
          <div style={{ position: 'relative', paddingLeft: 16 }}>
            {/* 竖线 */}
            <div style={{
              position: 'absolute', left: 5, top: 8, bottom: 8,
              width: 1, background: 'rgba(255,255,255,0.12)',
            }} />

            {dest.days.map((day, idx) => (
              <button
                key={idx}
                onClick={() => scrollToDay(idx)}
                style={{
                  display: 'block', width: '100%', textAlign: 'left',
                  background: 'none', border: 'none', cursor: 'pointer',
                  padding: '6px 0', position: 'relative', marginBottom: 4,
                }}
              >
                {/* 圆点 */}
                <div style={{
                  position: 'absolute', left: -13, top: '50%', transform: 'translateY(-50%)',
                  width: 7, height: 7, borderRadius: '50%',
                  background: activeDay === idx ? 'white' : 'rgba(255,255,255,0.25)',
                  border: activeDay === idx ? 'none' : '1px solid rgba(255,255,255,0.3)',
                  transition: 'background 0.2s',
                }} />
                <p style={{
                  fontFamily: "'Special Elite', monospace",
                  fontSize: '0.6rem', letterSpacing: '0.08em',
                  opacity: activeDay === idx ? 0.9 : 0.38,
                  transition: 'opacity 0.2s',
                  color: 'white', margin: 0,
                }}>
                  {day.date}
                </p>
                <p style={{
                  fontFamily: "'Caveat', cursive",
                  fontSize: '0.82rem',
                  opacity: activeDay === idx ? 0.85 : 0.45,
                  transition: 'opacity 0.2s',
                  color: 'white', margin: 0,
                }}>
                  {day.label}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* ── 右侧：双列瀑布流 ── */}
        <div
          ref={scrollRef}
          style={{ flex: 1, overflowY: 'auto', paddingRight: 6 }}
          onScroll={(e) => {
            // 根据滚动位置更新 activeDay
            const containerTop = e.currentTarget.scrollTop;
            let closest = 0;
            dayRefs.current.forEach((el, idx) => {
              if (el && el.offsetTop - 20 <= containerTop) closest = idx;
            });
            setActiveDay(closest);
          }}
        >
          <MasonryWall days={dest.days} dayRefs={dayRefs} />
        </div>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────
// 主界面：2行 × 3列 网格
// ──────────────────────────────────────────────────────────
export default function JourneyPage({ resetSignal }) {
  const [selected, setSelected] = useState(null);
  const [transitioning, setTransitioning] = useState(false);

  // 点击底部 Journey 导航按钮时重置回目录
  useEffect(() => {
    if (!resetSignal) return; // 初始化时不触发
    setSelected(null);
    setTransitioning(false);
  }, [resetSignal]); // eslint-disable-line react-hooks/exhaustive-deps

  const enterDetail = (dest) => {
    setTransitioning(true);
    setTimeout(() => {
      setSelected(dest);
      setTransitioning(false);
    }, 250);
  };

  const exitDetail = () => {
    setTransitioning(true);
    setTimeout(() => {
      setSelected(null);
      setTransitioning(false);
    }, 250);
  };

  return (
    <div
      className="w-full h-full"
      style={{ opacity: transitioning ? 0 : 1, transition: 'opacity 0.25s ease' }}
    >
      {/* SVG 全局滤镜 */}
      <svg width="0" height="0" className="absolute pointer-events-none">
        <defs>
          <filter id="sketchy" x="-5%" y="-5%" width="110%" height="110%">
            <feTurbulence type="fractalNoise" baseFrequency="0.065" numOctaves="2" seed="7" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="1.5"
              xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>
      </svg>

      {selected ? (
        <DestinationDetail dest={selected} onBack={exitDetail} />
      ) : (
        // 主界面
        <div className="w-full h-full flex flex-col items-center justify-center" style={{ padding: '40px 80px 80px' }}>
          <p
            className="jitter-text mb-10"
            style={{ fontFamily: "'Special Elite', monospace", fontSize: '0.72rem', letterSpacing: '0.22em', opacity: 0.3 }}
          >
            JOURNEY  ·  旅行碎片
          </p>

          {/* 2 × 3 网格 */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gridTemplateRows: 'repeat(2, 1fr)',
              gap: '48px 64px',
              maxWidth: 640,
              width: '100%',
            }}
          >
            {destinations.map((dest) => {
              const Icon = ICON_MAP[dest.iconType];
              return (
                <div
                  key={dest.id}
                  className="flex flex-col items-center gap-3 cursor-pointer group"
                  onClick={() => enterDetail(dest)}
                >
                  <div className="icon-hover group-hover:scale-110 transition-transform duration-200">
                    {Icon && <Icon />}
                  </div>
                  <p
                    className="jitter-text group-hover:opacity-100 transition-opacity"
                    style={{
                      fontFamily: "'Caveat', cursive",
                      fontSize: '1.05rem',
                      opacity: 0.7,
                      letterSpacing: '0.08em',
                    }}
                  >
                    {dest.name}
                  </p>
                  <p
                    className="opacity-0 group-hover:opacity-40 transition-opacity"
                    style={{ fontFamily: "'Special Elite', monospace", fontSize: '0.62rem', letterSpacing: '0.12em' }}
                  >
                    {dest.time}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
