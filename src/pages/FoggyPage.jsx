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
import { useState, useEffect } from 'react';
import { usePlayer } from '../context/PlayerContext';
import { films, albums, bassCovers, bassCollectionUrl } from '../data/hobbies';

// 处理 public 目录下的静态资源路径（兼容 GitHub Pages 子路径部署）
const assetUrl = (path) => `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`;

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
        Movie
      </h2>

      <div className="scroll-container flex-1">
        <div className="grid grid-cols-2 gap-5 pr-4">
          {films.map((film) => (
            <div key={film.id} className="film-card flex gap-0 overflow-hidden" style={{ height: 180 }}>
              {/* 左侧：海报 */}
              <div
                className="flex-shrink-0"
                style={{ width: 120, flexShrink: 0, position: 'relative' }}
              >
                {film.poster ? (
                  <img
                    src={assetUrl(film.poster)}
                    alt={film.title}
                    style={{
                      position: 'absolute', inset: 0,
                      width: '100%', height: '100%',
                      objectFit: 'cover', objectPosition: 'center top',
                      display: 'block',
                    }}
                  />
                ) : (
                  <div style={{ position: 'absolute', inset: 0, background: '#1a1a1a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg width="36" height="44" viewBox="0 0 36 44" fill="none" style={{ opacity: 0.25 }}>
                      <rect x="2" y="2" width="32" height="40" rx="2" stroke="white" strokeWidth="1.5" fill="none" />
                      <line x1="2" y1="12" x2="34" y2="12" stroke="white" strokeWidth="1" />
                      <line x1="12" y1="2" x2="12" y2="12" stroke="white" strokeWidth="1" />
                      <line x1="24" y1="2" x2="24" y2="12" stroke="white" strokeWidth="1" />
                    </svg>
                  </div>
                )}
                {/* 评分徽章 */}
                {film.rating && (
                  <div style={{
                    position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 1,
                    background: 'rgba(0,0,0,0.7)', textAlign: 'center',
                    padding: '3px 0',
                    fontFamily: "'Special Elite', monospace",
                    fontSize: '0.72rem',
                    color: '#f5c518',
                    letterSpacing: '0.05em',
                  }}>
                    ★ {film.rating}
                  </div>
                )}
              </div>

              {/* 右侧：文字 */}
              <div className="flex-1 p-3" style={{ borderLeft: '1.5px solid rgba(255,255,255,0.15)' }}>
                <div className="flex flex-wrap items-baseline gap-2 mb-1">
                  <h3 style={{ fontFamily: "'Caveat', cursive", fontSize: '1.05rem', fontWeight: 700, lineHeight: 1.2 }}>{film.title}</h3>
                  {film.titleEn && (
                    <span style={{ fontFamily: "'Special Elite', monospace", fontSize: '0.62rem', opacity: 0.35 }}>{film.titleEn}</span>
                  )}
                </div>
                <p style={{ fontFamily: "'Special Elite', monospace", fontSize: '0.65rem', opacity: 0.35, marginBottom: 4, letterSpacing: '0.04em' }}>
                  {film.year} · {film.genre}
                </p>
                <p style={{ fontFamily: "'Caveat', cursive", fontSize: '0.82rem', opacity: 0.5, marginBottom: 2 }}>
                  导演：{film.director}
                </p>
                <p style={{ fontFamily: "'Caveat', cursive", fontSize: '0.78rem', opacity: 0.4 }}>
                  {film.cast}
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
// 子页：音乐（播放状态来自全局 PlayerContext）
// ──────────────────────────────────────────────────────────
function MusicSubPage({ onBack }) {
  const [activeIdx, setActiveIdx] = useState(0);
  const album = albums[activeIdx];

  // 从全局 Context 取播放状态
  const { playingTrack, isPlaying, playSong } = usePlayer();

  return (
    <div className="w-full h-full flex flex-col" style={{ padding: '40px 60px 0' }}>

      <BackButton onClick={onBack} />
      <h2
        className="jitter-text mb-6"
        style={{ fontFamily: "'Caveat', cursive", fontSize: '2rem', fontWeight: 700 }}
      >
        Music
      </h2>

      {/* 内容区：底部留 BottomNav + PlayerBar 高度 */}
      <div className="flex gap-10 min-h-0" style={{ flex: 1, paddingBottom: playingTrack ? 16 : 16 }}>
        {/* 左：专辑列表（约占 2.3 份） */}
        <div className="flex flex-col gap-2 scroll-container" style={{ flex: '2.3', minWidth: 0 }}>
          {albums.map((a, i) => (
            <button
              key={a.id}
              onClick={() => setActiveIdx(i)}
              className="flex items-center gap-5 group text-left"
              style={{
                background: i === activeIdx ? 'rgba(255,255,255,0.07)' : 'transparent',
                borderLeft: i === activeIdx ? '2px solid rgba(255,255,255,0.5)' : '2px solid transparent',
                borderTop: 'none', borderRight: 'none', borderBottom: 'none',
                borderRadius: 0,
                padding: '12px 16px',
                cursor: 'pointer',
                transition: 'all 0.2s',
                color: 'white',
              }}
            >
              {/* 封面 */}
              <div style={{
                width: 62, height: 62, borderRadius: 3, overflow: 'hidden', flexShrink: 0,
                border: '1px solid rgba(255,255,255,0.12)',
                filter: i === activeIdx ? 'none' : 'grayscale(30%)',
                transition: 'filter 0.3s',
              }}>
                {a.cover
                  ? <img src={a.cover} alt={a.albumTitle} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  : <div style={{ width: '100%', height: '100%', background: '#1a1a1a' }} />
                }
              </div>
              {/* 文字 */}
              <div className="flex-1 min-w-0">
                <p style={{
                  fontFamily: "'Caveat', cursive", fontSize: '1.05rem',
                  fontWeight: i === activeIdx ? 700 : 400,
                  opacity: i === activeIdx ? 1 : 0.55,
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  marginBottom: 3, transition: 'opacity 0.2s',
                }}>
                  {a.albumTitle}
                </p>
                <p style={{ fontFamily: "'Caveat', cursive", fontSize: '0.82rem', opacity: i === activeIdx ? 0.55 : 0.3 }}>
                  {a.artist}
                  {a.year ? <span style={{ marginLeft: 8, fontSize: '0.75rem', opacity: 0.6 }}>{a.year}</span> : null}
                </p>
              </div>
            </button>
          ))}
        </div>

        {/* 分割线 */}
        <div style={{ width: 1, background: 'rgba(255,255,255,0.08)', flexShrink: 0, alignSelf: 'stretch' }} />

        {/* 右：曲目列表 */}
        <div className="flex flex-col" style={{ flex: 1, minWidth: 0 }}>
          {/* 专辑信息头 */}
          <div className="flex items-center gap-4 mb-5">
            <div style={{ width: 48, height: 48, borderRadius: 3, overflow: 'hidden', flexShrink: 0, border: '1px solid rgba(255,255,255,0.15)' }}>
              <img src={album.cover} alt={album.albumTitle} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <div className="min-w-0">
              <p style={{ fontFamily: "'Caveat', cursive", fontSize: '0.95rem', fontWeight: 700, opacity: 0.9, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {album.albumTitle}
              </p>
              <a href={album.url} target="_blank" rel="noopener noreferrer"
                style={{ fontFamily: "'Special Elite', monospace", fontSize: '0.6rem', opacity: 0.35, letterSpacing: '0.06em', textDecoration: 'none', color: 'inherit' }}>
                {album.artist} · {album.year} · 网易云 ↗
              </a>
            </div>
          </div>

          {/* 曲目列表 */}
          <div className="scroll-container flex-1">
            <div className="flex flex-col">
              {(album.tracks || []).map((track, ti) => {
                const isActive = playingTrack?.id === track.id;
                return (
                  <button
                    key={track.id}
                    onClick={() => playSong(track, album, ti)}
                    className="flex items-center gap-3 group text-left"
                    style={{
                      background: 'transparent', border: 'none', color: 'white',
                      padding: '7px 4px',
                      borderBottom: '1px solid rgba(255,255,255,0.04)',
                      cursor: 'pointer', width: '100%',
                    }}
                  >
                    {/* 序号 / 播放状态 */}
                    <span style={{
                      fontFamily: "'Special Elite', monospace", fontSize: '0.6rem',
                      opacity: isActive ? 0.8 : 0.25, width: 20, textAlign: 'right', flexShrink: 0,
                      color: isActive ? 'white' : 'inherit',
                    }}>
                      {isActive && isPlaying
                        ? '▶'
                        : isActive && !isPlaying
                          ? '‖'
                          : String(ti + 1).padStart(2, '0')}
                    </span>
                    {/* 曲名 */}
                    <span style={{
                      fontFamily: "'Caveat', cursive", fontSize: '0.9rem',
                      opacity: isActive ? 1 : 0.7,
                      fontWeight: isActive ? 700 : 400,
                      overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                      flex: 1,
                    }}>
                      {track.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* 播放器条现在在 App 层全局渲染，此处无需重复 */}
    </div>
  );
}

// ──────────────────────────────────────────────────────────
// 子页：贝斯
// ──────────────────────────────────────────────────────────
function BassSubPage({ onBack }) {
  return (
    <div className="w-full h-full flex flex-col" style={{ padding: '40px 60px 80px' }}>
      <BackButton onClick={onBack} />
      <h2
        className="jitter-text mb-8"
        style={{ fontFamily: "'Caveat', cursive", fontSize: '2rem', fontWeight: 700 }}
      >
        Bass Cover
      </h2>

      <div className="flex flex-1 gap-8 overflow-hidden">
        {/* 左：小红书合集入口（无边框，铺满整个左侧） */}
        <a
          href={bassCollectionUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-shrink-0 flex flex-col items-center justify-center gap-6 group cursor-pointer"
          style={{ width: '38%', textDecoration: 'none', color: 'inherit' }}
        >
          {/* 贝斯手绘图标 */}
          <svg width="72" height="72" viewBox="0 0 90 90" fill="none" className="jitter-svg group-hover:opacity-100 transition-opacity" style={{ opacity: 0.65, filter: 'url(#sketchy)' }}>
            <rect x="40" y="6" width="10" height="42" rx="3" stroke="white" strokeWidth="2" fill="none" />
            <ellipse cx="45" cy="6" rx="8" ry="6" stroke="white" strokeWidth="2" fill="none" />
            <line x1="40" y1="16" x2="50" y2="16" stroke="white" strokeWidth="1.2" />
            <line x1="40" y1="22" x2="50" y2="22" stroke="white" strokeWidth="1.2" />
            <line x1="40" y1="28" x2="50" y2="28" stroke="white" strokeWidth="1.2" />
            <line x1="40" y1="34" x2="50" y2="34" stroke="white" strokeWidth="1.2" />
            <path d="M35,48 Q22,50 20,60 Q19,70 25,76 Q30,82 40,82 L50,82 Q60,82 65,76 Q71,70 70,60 Q68,50 55,48 L50,47 L50,48 L40,48 L40,47 Z" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <line x1="41" y1="8" x2="41" y2="68" stroke="white" strokeWidth="0.8" style={{ opacity: 0.5 }} />
            <line x1="43" y1="8" x2="43" y2="68" stroke="white" strokeWidth="0.8" style={{ opacity: 0.5 }} />
            <line x1="47" y1="8" x2="47" y2="68" stroke="white" strokeWidth="0.8" style={{ opacity: 0.5 }} />
            <line x1="49" y1="8" x2="49" y2="68" stroke="white" strokeWidth="0.8" style={{ opacity: 0.5 }} />
          </svg>
          <div className="text-center">
            <p style={{ fontFamily: "'Caveat', cursive", fontSize: '1.2rem', fontWeight: 700, marginBottom: 6, opacity: 0.9 }}>
              小烂贝斯手试图cover记录
            </p>
            <p style={{ fontFamily: "'Special Elite', monospace", fontSize: '0.65rem', opacity: 0.35, letterSpacing: '0.1em' }}>
              {bassCovers.length} covers · 小红书合集
            </p>
          </div>
          {/* 外链箭头 */}
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="opacity-25 group-hover:opacity-65 transition-opacity">
            <path d="M4,10 L16,10 M11,5 L16,10 L11,15" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </a>

        {/* 右：曲目列表（3/5） */}
        <div
          className="scroll-container flex-1"
          style={{ borderLeft: '1px solid rgba(255,255,255,0.12)', paddingLeft: 32 }}
        >
          <p style={{ fontFamily: "'Special Elite', monospace", fontSize: '0.65rem', opacity: 0.3, letterSpacing: '0.15em', marginBottom: 16 }}>
            SETLIST
          </p>
          {bassCovers.map((cover, i) => (
            <a
              key={cover.id}
              href={cover.url || bassCollectionUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start gap-4 py-3 border-b group"
              style={{ borderColor: 'rgba(255,255,255,0.08)', textDecoration: 'none', color: 'inherit' }}
            >
              <span style={{ fontFamily: "'Special Elite', monospace", fontSize: '0.65rem', opacity: 0.25, minWidth: 22, paddingTop: 3, flexShrink: 0 }}>
                {String(i + 1).padStart(2, '0')}
              </span>
              <div className="flex-1 min-w-0">
                <p
                  className="group-hover:opacity-100 transition-opacity"
                  style={{ fontFamily: "'Caveat', cursive", fontSize: '1rem', opacity: 0.85, marginBottom: 1 }}
                >
                  {cover.title}
                </p>
                {cover.note ? (
                  <p style={{ fontFamily: "'Caveat', cursive", fontSize: '0.8rem', opacity: 0.4, fontStyle: 'italic' }}>
                    {cover.note}
                  </p>
                ) : null}
              </div>
              {/* 外链小图标 */}
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="flex-shrink-0 opacity-0 group-hover:opacity-40 transition-opacity" style={{ marginTop: 4 }}>
                <path d="M2,7 L12,7 M8,3 L12,7 L8,11" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────
// 主页：三个图标入口
// ──────────────────────────────────────────────────────────
const FOGGY_ITEMS = [
  { id: 'film',  label: 'Movie',  Icon: ClapperboardIcon },
  { id: 'music', label: 'Music',  Icon: VinylIcon },
  { id: 'bass',  label: 'Bass',   Icon: BassIcon },
];

export default function FoggyPage({ openMusicSub, onMusicSubOpened, resetSignal }) {
  const [sub, setSub] = useState(null); // null | 'film' | 'music' | 'bass'
  const [transitioning, setTransitioning] = useState(false);
  const { setFoggySubPage } = usePlayer();

  // 当外部触发 openMusicSub 时，直接进入 Music 子页
  useEffect(() => {
    if (openMusicSub) {
      setSub('music');
      setFoggySubPage('music');
      onMusicSubOpened && onMusicSubOpened();
    }
  }, [openMusicSub]); // eslint-disable-line react-hooks/exhaustive-deps

  // 点击底部 Foggy 导航按钮时重置回目录
  useEffect(() => {
    if (resetSignal === 0) return; // 初始化时不触发
    setSub(null);
    setFoggySubPage(null);
    setTransitioning(false);
  }, [resetSignal]); // eslint-disable-line react-hooks/exhaustive-deps

  // 离开 FoggyPage 时清除子页状态
  useEffect(() => {
    return () => setFoggySubPage(null);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const enterSub = (id) => {
    setTransitioning(true);
    setTimeout(() => {
      setSub(id);
      setFoggySubPage(id);
      setTransitioning(false);
    }, 250);
  };

  const exitSub = () => {
    setTransitioning(true);
    setTimeout(() => {
      setSub(null);
      setFoggySubPage(null);
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
        // 子页面（relative 定位容器供播放器条 absolute 锚定）
        <div className="w-full h-full" style={{ position: 'relative' }}>
          {renderSub()}
        </div>
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
