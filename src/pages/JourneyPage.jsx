/**
 * JourneyPage - 【Journey】旅行地图
 *
 * 主界面：2行 × 3列 的网格矩阵，6 个手绘图标 + 地名
 * 点击进入详情子页（左固定文字 + 右瀑布流照片墙）
 */
import { useState } from 'react';
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
      {/* 山体 */}
      <path d="M6,60 L24,28 L36,16 L48,28 L66,60 Z"
        stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      {/* 雪顶 */}
      <path d="M28,34 Q36,16 44,34 Q40,30 36,28 Q32,30 28,34 Z"
        stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" style={{ opacity: 0.85 }} />
      {/* 云雾 */}
      <path d="M10,50 Q18,44 28,48 Q38,52 50,46 Q60,42 66,48"
        stroke="white" strokeWidth="1.5" strokeLinecap="round" fill="none" style={{ opacity: 0.4 }} />
      {/* 山脚 */}
      <line x1="4" y1="63" x2="68" y2="63" stroke="white" strokeWidth="1.8" strokeLinecap="round" style={{ opacity: 0.5 }} />
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

// 枫叶
function MapleIcon() {
  return (
    <svg width="72" height="72" viewBox="0 0 72 72" fill="none" className="jitter-svg" style={{ filter: 'url(#sketchy)' }}>
      {/* 枫叶路径（简化5瓣） */}
      <path
        d="M36,10 L40,22 L52,18 L44,28 L58,32 L46,34 L52,46 L38,40 L36,54 L34,40 L20,46 L26,34 L14,32 L28,28 L20,18 L32,22 Z"
        stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"
      />
      {/* 茎 */}
      <line x1="36" y1="54" x2="36" y2="64" stroke="white" strokeWidth="2.2" strokeLinecap="round" />
      {/* 叶脉 */}
      <line x1="36" y1="26" x2="36" y2="48" stroke="white" strokeWidth="0.8" style={{ opacity: 0.3 }} />
      <line x1="26" y1="32" x2="36" y2="38" stroke="white" strokeWidth="0.7" style={{ opacity: 0.25 }} />
      <line x1="46" y1="32" x2="36" y2="38" stroke="white" strokeWidth="0.7" style={{ opacity: 0.25 }} />
    </svg>
  );
}

// 炸鸡腿
function ChickenIcon() {
  return (
    <svg width="72" height="72" viewBox="0 0 72 72" fill="none" className="jitter-svg" style={{ filter: 'url(#sketchy)' }}>
      {/* 鸡腿（手持部分） */}
      <path d="M42,56 Q50,62 54,60 Q58,58 56,54 Q54,50 46,52 L36,44"
        stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      {/* 肉体 */}
      <path d="M36,44 Q24,48 18,38 Q12,28 20,20 Q28,12 38,18 Q48,24 44,36 Z"
        stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      {/* 表皮纹路 */}
      <path d="M24,30 Q28,24 34,28" stroke="white" strokeWidth="1" strokeLinecap="round" fill="none" style={{ opacity: 0.35 }} />
      <path d="M30,38 Q36,34 40,38" stroke="white" strokeWidth="1" strokeLinecap="round" fill="none" style={{ opacity: 0.3 }} />
      {/* 骨头端 */}
      <circle cx="51" cy="59" r="4" stroke="white" strokeWidth="1.8" fill="none" />
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
// 照片墙（瀑布流 / 矩阵）
// ──────────────────────────────────────────────────────────
function PhotoWall({ photos }) {
  if (!photos || photos.length === 0) {
    // 空占位
    return (
      <div className="masonry-grid pr-4">
        {Array.from({ length: 9 }).map((_, i) => (
          <div
            key={i}
            className="masonry-item sketch-border flex items-center justify-center"
            style={{
              height: i % 3 === 0 ? 180 : i % 3 === 1 ? 130 : 160,
              background: `rgba(255,255,255,0.03)`,
            }}
          >
            <p style={{ fontFamily: "'Caveat', cursive", fontSize: '0.8rem', opacity: 0.2 }}>
              照片待添加
            </p>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="masonry-grid pr-4">
      {photos.map((src, i) => (
        <div key={i} className="masonry-item sketch-border overflow-hidden">
          <img
            src={src}
            alt={`travel-${i}`}
            style={{ width: '100%', display: 'block', objectFit: 'cover' }}
          />
        </div>
      ))}
    </div>
  );
}

// ──────────────────────────────────────────────────────────
// 详情页
// ──────────────────────────────────────────────────────────
function DestinationDetail({ dest, onBack }) {
  return (
    <div className="w-full h-full flex flex-col" style={{ padding: '40px 60px 80px' }}>
      <BackButton onClick={onBack} />

      <div className="flex flex-1 gap-12 overflow-hidden">
        {/* 左 1/3：固定文字 */}
        <div
          className="flex-shrink-0 flex flex-col"
          style={{ width: '30%' }}
        >
          <h2
            className="jitter-text mb-1"
            style={{ fontFamily: "'Caveat', cursive", fontSize: '2.4rem', fontWeight: 700, lineHeight: 1 }}
          >
            {dest.name}
          </h2>
          <p
            className="mb-6"
            style={{ fontFamily: "'Special Elite', monospace", fontSize: '0.72rem', letterSpacing: '0.15em', opacity: 0.4 }}
          >
            {dest.time}
          </p>

          {/* 分隔线 */}
          <svg width="100%" height="10" className="mb-5 opacity-25" viewBox="0 0 150 10" preserveAspectRatio="none" fill="none">
            <path d="M0,5 Q30,2 60,6 Q90,9 120,4 Q140,2 150,5" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
          </svg>

          <p
            style={{
              fontFamily: "'Caveat', cursive",
              fontSize: '1.0rem',
              lineHeight: 1.9,
              whiteSpace: 'pre-wrap',
              opacity: 0.8,
              flex: 1,
              overflow: 'hidden',
            }}
          >
            {dest.intro}
          </p>
        </div>

        {/* 右 2/3：照片瀑布流 */}
        <div className="flex-1 scroll-container">
          <PhotoWall photos={dest.photos} />
        </div>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────
// 主界面：2行 × 3列 网格
// ──────────────────────────────────────────────────────────
export default function JourneyPage() {
  const [selected, setSelected] = useState(null);
  const [transitioning, setTransitioning] = useState(false);

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
