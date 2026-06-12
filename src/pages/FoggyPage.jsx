/**
 * FoggyPage - 【Foggy】个人爱好
 *
 * 主界面：三个手绘图标 + 名称
 *   - 场记板 → 影视子页
 *   - 黑胶唱片 → 音乐子页
 *   - 贝斯 → 弹拨子页
 *
 * 子页面左上角有手绘返回箭头
 */
import { useState, useRef, useEffect } from 'react';
import { films, albums, bassCovers } from '../data/hobbies';

// ──────────────────────────────────────────────────────────
// SVG 图标：场记板
// ──────────────────────────────────────────────────────────
function ClapperboardIcon() {
  return (
    <svg width="90" height="90" viewBox="0 0 90 90" fill="none" className="jitter-svg" style={{ filter: 'url(#sketchy)' }}>
      {/* 板身 */}
      <rect x="12" y="30" width="66" height="48" rx="3" stroke="white" strokeWidth="2.2" fill="none" />
      {/* 顶部打板 */}
      <rect x="12" y="20" width="66" height="12" rx="2" stroke="white" strokeWidth="2" fill="none" />
      {/* 打板斜条纹 */}
      <line x1="22" y1="20" x2="18" y2="32" stroke="white" strokeWidth="2" strokeLinecap="round" />
      <line x1="32" y1="20" x2="28" y2="32" stroke="white" strokeWidth="2" strokeLinecap="round" />
      <line x1="42" y1="20" x2="38" y2="32" stroke="white" strokeWidth="2" strokeLinecap="round" />
      <line x1="52" y1="20" x2="48" y2="32" stroke="white" strokeWidth="2" strokeLinecap="round" />
      <line x1="62" y1="20" x2="58" y2="32" stroke="white" strokeWidth="2" strokeLinecap="round" />
      <line x1="72" y1="20" x2="68" y2="32" stroke="white" strokeWidth="2" strokeLinecap="round" />
      {/* 打板顶边连接轴 */}
      <line x1="12" y1="20" x2="78" y2="20" stroke="white" strokeWidth="2.2" strokeLinecap="round" />
      {/* 录制线 */}
      <line x1="22" y1="48" x2="68" y2="48" stroke="white" strokeWidth="1.5" strokeLinecap="round" style={{ opacity: 0.5 }} />
      <line x1="22" y1="56" x2="55" y2="56" stroke="white" strokeWidth="1.5" strokeLinecap="round" style={{ opacity: 0.4 }} />
      <line x1="22" y1="64" x2="62" y2="64" stroke="white" strokeWidth="1.5" strokeLinecap="round" style={{ opacity: 0.35 }} />
    </svg>
  );
}

// ──────────────────────────────────────────────────────────
// SVG 图标：黑胶唱片
// ──────────────────────────────────────────────────────────
function VinylIcon() {
  return (
    <svg width="90" height="90" viewBox="0 0 90 90" fill="none" className="jitter-svg" style={{ filter: 'url(#sketchy)' }}>
      {/* 外圆 */}
      <circle cx="45" cy="45" r="36" stroke="white" strokeWidth="2.2" fill="none" />
      {/* 凹槽纹路 */}
      <circle cx="45" cy="45" r="28" stroke="white" strokeWidth="0.8" fill="none" style={{ opacity: 0.4 }} />
      <circle cx="45" cy="45" r="22" stroke="white" strokeWidth="0.8" fill="none" style={{ opacity: 0.3 }} />
      <circle cx="45" cy="45" r="16" stroke="white" strokeWidth="0.8" fill="none" style={{ opacity: 0.25 }} />
      {/* 中心标签圆 */}
      <circle cx="45" cy="45" r="10" stroke="white" strokeWidth="2" fill="none" />
      {/* 中心圆孔 */}
      <circle cx="45" cy="45" r="2.5" stroke="white" strokeWidth="1.8" fill="none" />
      {/* 高光线 */}
      <path d="M20,35 Q30,28 45,28" stroke="white" strokeWidth="0.9" strokeLinecap="round" fill="none" style={{ opacity: 0.3 }} />
    </svg>
  );
}

// ──────────────────────────────────────────────────────────
// SVG 图标：贝斯吉他
// ──────────────────────────────────────────────────────────
function BassIcon() {
  return (
    <svg width="90" height="90" viewBox="0 0 90 90" fill="none" className="jitter-svg" style={{ filter: 'url(#sketchy)' }}>
      {/* 琴颈 */}
      <rect x="40" y="6" width="10" height="42" rx="3" stroke="white" strokeWidth="2" fill="none" />
      {/* 琴头 */}
      <ellipse cx="45" cy="6" rx="8" ry="6" stroke="white" strokeWidth="2" fill="none" />
      {/* 弦钮 */}
      <circle cx="40" cy="4" r="2.5" stroke="white" strokeWidth="1.5" fill="none" />
      <circle cx="50" cy="4" r="2.5" stroke="white" strokeWidth="1.5" fill="none" />
      <circle cx="38" cy="9" r="2.5" stroke="white" strokeWidth="1.5" fill="none" />
      <circle cx="52" cy="9" r="2.5" stroke="white" strokeWidth="1.5" fill="none" />
      {/* 品格 */}
      <line x1="40" y1="16" x2="50" y2="16" stroke="white" strokeWidth="1.2" />
      <line x1="40" y1="22" x2="50" y2="22" stroke="white" strokeWidth="1.2" />
      <line x1="40" y1="28" x2="50" y2="28" stroke="white" strokeWidth="1.2" />
      <line x1="40" y1="34" x2="50" y2="34" stroke="white" strokeWidth="1.2" />
      {/* 琴身（Fender Jazz Bass 轮廓简化） */}
      <path
        d="M35,48 Q22,50 20,60 Q19,70 25,76 Q30,82 40,82 L50,82 Q60,82 65,76 Q71,70 70,60 Q68,50 55,48 L50,47 L50,48 L40,48 L40,47 Z"
        stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none"
      />
      {/* 音孔 */}
      <ellipse cx="43" cy="65" rx="3" ry="5" stroke="white" strokeWidth="1.5" fill="none" style={{ opacity: 0.7 }} />
      {/* 拾音器 */}
      <rect x="36" y="56" width="18" height="6" rx="1" stroke="white" strokeWidth="1.5" fill="none" style={{ opacity: 0.6 }} />
      {/* 弦（4 根） */}
      <line x1="41" y1="8" x2="41" y2="68" stroke="white" strokeWidth="0.8" style={{ opacity: 0.5 }} />
      <line x1="43" y1="8" x2="43" y2="68" stroke="white" strokeWidth="0.8" style={{ opacity: 0.5 }} />
      <line x1="47" y1="8" x2="47" y2="68" stroke="white" strokeWidth="0.8" style={{ opacity: 0.5 }} />
      <line x1="49" y1="8" x2="49" y2="68" stroke="white" strokeWidth="0.8" style={{ opacity: 0.5 }} />
    </svg>
  );
}

// ──────────────────────────────────────────────────────────
// 返回按钮
// ──────────────────────────────────────────────────────────
function BackButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 bg-transparent border-none cursor-pointer group"
      style={{ marginBottom: 24 }}
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
// 子页：影视
// ──────────────────────────────────────────────────────────
function FilmSubPage({ onBack }) {
  return (
    <div className="w-full h-full flex flex-col" style={{ padding: '40px 60px 80px' }}>
      <BackButton onClick={onBack} />
      <h2
        className="jitter-text mb-8"
        style={{ fontFamily: "'Caveat', cursive", fontSize: '2rem', fontWeight: 700 }}
      >
        影视收藏
      </h2>

      <div className="scroll-container flex-1">
        <div className="grid grid-cols-1 gap-6 pr-4">
          {films.map((film) => (
            <div key={film.id} className="film-card flex gap-0 overflow-hidden" style={{ minHeight: 120 }}>
              {/* 左侧：海报占位 */}
              <div
                className="flex-shrink-0 flex items-center justify-center"
                style={{
                  width: 90,
                  background: film.color,
                  borderRight: '1.5px solid rgba(255,255,255,0.3)',
                }}
              >
                {film.poster ? (
                  <img src={film.poster} alt={film.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <svg width="36" height="44" viewBox="0 0 36 44" fill="none" style={{ opacity: 0.25 }}>
                    <rect x="2" y="2" width="32" height="40" rx="2" stroke="white" strokeWidth="1.5" fill="none" />
                    <line x1="2" y1="12" x2="34" y2="12" stroke="white" strokeWidth="1" />
                    <line x1="12" y1="2" x2="12" y2="12" stroke="white" strokeWidth="1" />
                    <line x1="24" y1="2" x2="24" y2="12" stroke="white" strokeWidth="1" />
                  </svg>
                )}
              </div>

              {/* 右侧：文字 */}
              <div className="flex-1 p-4">
                <div className="flex items-baseline gap-3 mb-1">
                  <h3 style={{ fontFamily: "'Caveat', cursive", fontSize: '1.2rem', fontWeight: 700 }}>{film.title}</h3>
                  <span style={{ fontFamily: "'Special Elite', monospace", fontSize: '0.72rem', opacity: 0.45 }}>{film.year}</span>
                  <span style={{ fontFamily: "'Caveat', cursive", fontSize: '0.82rem', opacity: 0.5 }}>{film.genre}</span>
                </div>
                <p style={{ fontFamily: "'Caveat', cursive", fontSize: '0.9rem', opacity: 0.55, marginBottom: 6 }}>
                  导演：{film.director}　主演：{film.cast}
                </p>
                <p style={{ fontFamily: "'Caveat', cursive", fontSize: '0.95rem', opacity: 0.8, fontStyle: 'italic' }}>
                  " {film.note} "
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────
// 子页：音乐
// ──────────────────────────────────────────────────────────
function CarouselOrList({ photos, songs }) {
  const [idx, setIdx] = useState(0);

  // 如果有照片，展示轮播
  if (photos && photos.length > 0) {
    return (
      <div className="relative w-full h-full flex items-center justify-center">
        <img
          src={photos[idx]}
          alt="live"
          className="w-full h-full object-cover"
          style={{ borderRadius: 2 }}
        />
        {photos.length > 1 && (
          <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-2">
            {photos.map((_, i) => (
              <button
                key={i}
                onClick={() => setIdx(i)}
                className="w-2 h-2 rounded-full border border-white transition-all bg-transparent cursor-pointer"
                style={{ background: i === idx ? 'white' : 'transparent' }}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  // 无照片：展示歌曲列表
  return (
    <div className="w-full h-full flex flex-col justify-center p-4">
      <p style={{ fontFamily: "'Caveat', cursive", fontSize: '0.82rem', opacity: 0.45, marginBottom: 8, letterSpacing: '0.1em' }}>
        喜爱歌曲
      </p>
      {songs.map((s, i) => (
        <div
          key={s}
          className="flex items-center gap-3 py-2"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.12)' }}
        >
          <span style={{ fontFamily: "'Special Elite', monospace", fontSize: '0.7rem', opacity: 0.35, minWidth: 18 }}>
            {String(i + 1).padStart(2, '0')}
          </span>
          <span style={{ fontFamily: "'Caveat', cursive", fontSize: '1rem', opacity: 0.85 }}>{s}</span>
        </div>
      ))}
    </div>
  );
}

function MusicSubPage({ onBack }) {
  return (
    <div className="w-full h-full flex flex-col" style={{ padding: '40px 60px 80px' }}>
      <BackButton onClick={onBack} />
      <h2
        className="jitter-text mb-8"
        style={{ fontFamily: "'Caveat', cursive", fontSize: '2rem', fontWeight: 700 }}
      >
        音乐收藏
      </h2>

      <div className="scroll-container flex-1">
        <div className="flex flex-col gap-6 pr-4">
          {albums.map((album) => (
            <div
              key={album.id}
              className="sketch-border flex overflow-hidden"
              style={{ minHeight: 160 }}
            >
              {/* 左：专辑信息 */}
              <div
                className="flex flex-col justify-center p-5"
                style={{ width: '45%', borderRight: '1.5px solid rgba(255,255,255,0.2)' }}
              >
                {/* 专辑封面占位 */}
                <div
                  className="flex items-center justify-center mb-4"
                  style={{ width: 64, height: 64, border: '1.5px solid rgba(255,255,255,0.4)', borderRadius: 2 }}
                >
                  {album.cover ? (
                    <img src={album.cover} alt={album.albumTitle} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <VinylIcon />
                  )}
                </div>
                <h3 style={{ fontFamily: "'Caveat', cursive", fontSize: '1.15rem', fontWeight: 700, marginBottom: 2 }}>
                  {album.albumTitle}
                </h3>
                <p style={{ fontFamily: "'Caveat', cursive", fontSize: '0.9rem', opacity: 0.6, marginBottom: 4 }}>
                  {album.artist} · {album.year}
                </p>
                <p style={{ fontFamily: "'Caveat', cursive", fontSize: '0.88rem', opacity: 0.7, fontStyle: 'italic' }}>
                  " {album.note} "
                </p>
              </div>

              {/* 右：现场照片 / 歌单 */}
              <div className="flex-1" style={{ minHeight: 160 }}>
                <CarouselOrList photos={album.livePhotos} songs={album.favSongs} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────
// 子页：贝斯
// ──────────────────────────────────────────────────────────
function BassSubPage({ onBack }) {
  const [activeId, setActiveId] = useState(bassCovers[0].id);
  const videoRef = useRef(null);

  const activeCover = bassCovers.find(c => c.id === activeId);

  // 切歌时重新加载视频
  useEffect(() => {
    if (videoRef.current && activeCover?.videoUrl) {
      videoRef.current.load();
      videoRef.current.play().catch(() => {});
    }
  }, [activeId]);

  return (
    <div className="w-full h-full flex flex-col" style={{ padding: '40px 60px 80px' }}>
      <BackButton onClick={onBack} />
      <h2
        className="jitter-text mb-8"
        style={{ fontFamily: "'Caveat', cursive", fontSize: '2rem', fontWeight: 700 }}
      >
        弹拨 · Bass Cover
      </h2>

      <div className="flex flex-1 gap-8 overflow-hidden">
        {/* 左：歌曲列表（1/3） */}
        <div
          className="scroll-container flex-shrink-0"
          style={{ width: '32%', borderRight: '1px solid rgba(255,255,255,0.15)' }}
        >
          {bassCovers.map((cover) => (
            <div
              key={cover.id}
              onClick={() => setActiveId(cover.id)}
              className={`py-4 px-3 cursor-pointer transition-all duration-200 border-b`}
              style={{
                borderColor: 'rgba(255,255,255,0.1)',
                background: activeId === cover.id ? 'rgba(255,255,255,0.06)' : 'transparent',
              }}
            >
              <p
                style={{
                  fontFamily: "'Caveat', cursive",
                  fontSize: '1.05rem',
                  fontWeight: activeId === cover.id ? 700 : 400,
                  opacity: activeId === cover.id ? 1 : 0.6,
                  marginBottom: 2,
                }}
              >
                {cover.title}
              </p>
              <p style={{ fontFamily: "'Caveat', cursive", fontSize: '0.85rem', opacity: 0.45 }}>
                {cover.artist}
              </p>
              {activeId === cover.id && (
                <p style={{ fontFamily: "'Special Elite', monospace", fontSize: '0.68rem', opacity: 0.35, marginTop: 2 }}>
                  {cover.duration}
                </p>
              )}
            </div>
          ))}
        </div>

        {/* 右：视频播放区（2/3） */}
        <div className="flex-1 flex flex-col gap-4">
          {/* 视频播放器 */}
          <div
            className="sketch-border flex items-center justify-center overflow-hidden"
            style={{ flex: '1 1 auto', minHeight: 200, background: '#0a0a0a' }}
          >
            {activeCover?.videoUrl ? (
              <video
                ref={videoRef}
                controls
                className="w-full h-full object-contain"
                style={{ maxHeight: 360 }}
              >
                <source src={activeCover.videoUrl} type="video/mp4" />
                <p style={{ color: 'rgba(255,255,255,0.4)', fontFamily: "'Caveat',cursive" }}>
                  您的浏览器不支持 video 标签
                </p>
              </video>
            ) : (
              <div className="flex flex-col items-center gap-4 opacity-30">
                <svg width="64" height="64" viewBox="0 0 64 64" fill="none" className="jitter-svg">
                  <circle cx="32" cy="32" r="28" stroke="white" strokeWidth="2" fill="none" />
                  <polygon points="26,22 26,42 46,32" stroke="white" strokeWidth="2" strokeLinejoin="round" fill="none" />
                </svg>
                <p style={{ fontFamily: "'Caveat', cursive", fontSize: '0.95rem' }}>
                  视频待上传
                </p>
              </div>
            )}
          </div>

          {/* 当前曲目信息 */}
          {activeCover && (
            <div className="px-1">
              <h3 style={{ fontFamily: "'Caveat', cursive", fontSize: '1.25rem', fontWeight: 700, marginBottom: 4 }}>
                {activeCover.title}
              </h3>
              <p style={{ fontFamily: "'Caveat', cursive", fontSize: '0.95rem', opacity: 0.55, marginBottom: 6 }}>
                {activeCover.artist} · {activeCover.duration}
              </p>
              <p style={{ fontFamily: "'Caveat', cursive", fontSize: '0.95rem', opacity: 0.75, fontStyle: 'italic' }}>
                " {activeCover.note} "
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────
// 主页：三个图标入口
// ──────────────────────────────────────────────────────────
const FOGGY_ITEMS = [
  { id: 'film',  label: '影视',  Icon: ClapperboardIcon },
  { id: 'music', label: '音乐',  Icon: VinylIcon },
  { id: 'bass',  label: '弹拨',  Icon: BassIcon },
];

export default function FoggyPage() {
  const [sub, setSub] = useState(null); // null | 'film' | 'music' | 'bass'
  const [transitioning, setTransitioning] = useState(false);

  const enterSub = (id) => {
    setTransitioning(true);
    setTimeout(() => {
      setSub(id);
      setTransitioning(false);
    }, 250);
  };

  const exitSub = () => {
    setTransitioning(true);
    setTimeout(() => {
      setSub(null);
      setTransitioning(false);
    }, 250);
  };

  // 渲染子页
  const renderSub = () => {
    if (sub === 'film')  return <FilmSubPage  onBack={exitSub} />;
    if (sub === 'music') return <MusicSubPage onBack={exitSub} />;
    if (sub === 'bass')  return <BassSubPage  onBack={exitSub} />;
    return null;
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
            <feTurbulence type="fractalNoise" baseFrequency="0.065" numOctaves="2" seed="5" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="1.5"
              xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>
      </svg>

      {sub ? (
        // 子页面
        renderSub()
      ) : (
        // 主界面：三图标
        <div className="w-full h-full flex flex-col items-center justify-center gap-6">
          <p
            className="jitter-text mb-6"
            style={{ fontFamily: "'Special Elite', monospace", fontSize: '0.72rem', letterSpacing: '0.22em', opacity: 0.3 }}
          >
            FOGGY  ·  个人爱好
          </p>

          <div className="flex items-end justify-center gap-20">
            {FOGGY_ITEMS.map(({ id, label, Icon }) => (
              <div
                key={id}
                className="flex flex-col items-center gap-4 cursor-pointer group"
                onClick={() => enterSub(id)}
              >
                <div className="icon-hover group-hover:scale-110 transition-transform duration-200">
                  <Icon />
                </div>
                <p
                  className="jitter-text group-hover:opacity-100 transition-opacity"
                  style={{
                    fontFamily: "'Caveat', cursive",
                    fontSize: '1.1rem',
                    opacity: 0.7,
                    letterSpacing: '0.08em',
                  }}
                >
                  {label}
                </p>
                {/* 下划线装饰 */}
                <svg className="opacity-0 group-hover:opacity-60 transition-opacity" width="40" height="6" viewBox="0 0 40 6" fill="none">
                  <path d="M2,4 Q10,1 20,4 Q30,6 38,3" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
