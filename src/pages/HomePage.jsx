/**
 * HomePage - 【I】 首页 / 自我介绍
 *
 * 头像：参考图片 - 直发垂肩、细框圆眼镜、下垂半睁眼、项链
 * 标签：围绕头像四周，出现后保持，不遮挡面部
 * 正方体：页面最底部与导航栏平行
 */
import { useState, useEffect, useRef, useCallback } from 'react';

// ============================================================
// 头像 SVG — 参考图片：直发、眼镜、下垂眼、项链
// ============================================================
function AvatarSVG({ onClick }) {
  return (
    <svg
      width="240"
      height="320"
      viewBox="0 0 240 320"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="jitter-svg cursor-pointer select-none"
      style={{ filter: 'url(#sketchy)' }}
      onClick={onClick}
      aria-label="舒予的手绘头像"
    >
      {/* ── 身体/肩膀（白色上衣轮廓） ── */}
      <path d="M60,295 Q60,270 72,260 Q88,248 108,244 L108,232 Q120,238 120,238 Q120,238 132,232 L132,244 Q152,248 168,260 Q180,270 180,295"
        stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      {/* 领口 */}
      <path d="M100,246 Q120,256 140,246" stroke="white" strokeWidth="1.8" strokeLinecap="round" fill="none" />

      {/* ── 颈部 ── */}
      <path d="M108,232 L108,246" stroke="white" strokeWidth="2" strokeLinecap="round" fill="none" />
      <path d="M132,232 L132,246" stroke="white" strokeWidth="2" strokeLinecap="round" fill="none" />

      {/* ── 项链 ── */}
      <path d="M108,246 Q120,252 132,246" stroke="white" strokeWidth="1.2" strokeLinecap="round" fill="none" style={{ opacity: 0.7 }} />
      <circle cx="120" cy="252" r="2" stroke="white" strokeWidth="1.2" fill="none" style={{ opacity: 0.7 }} />
      <circle cx="120" cy="252" r="0.8" fill="white" style={{ opacity: 0.6 }} />

      {/* ── 脸型（圆润、稍宽）── */}
      <path
        d="M76,128 Q72,114 74,100 Q76,80 88,66 Q102,50 120,48 Q138,50 152,66 Q164,80 166,100 Q168,114 164,128 L162,178 Q160,202 144,212 Q134,218 120,218 Q106,218 96,212 Q80,202 78,178 Z"
        stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none"
      />

      {/* ── 头发：参考图 - 中分直发，两侧垂肩，有层次感 ── */}
      {/* 左侧头发大块（从发际线垂到肩膀） */}
      <path
        d="M88,66 Q72,58 64,72 Q54,90 56,120 Q56,150 58,178 Q60,200 66,220 Q72,238 76,250 Q84,258 90,256"
        stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"
      />
      {/* 左侧头发内侧轮廓（紧贴脸） */}
      <path
        d="M88,66 Q82,80 78,100 Q76,120 76,140"
        stroke="white" strokeWidth="1.5" strokeLinecap="round" fill="none" style={{ opacity: 0.5 }}
      />
      {/* 左侧发尾 */}
      <path
        d="M66,220 Q62,232 68,244 Q74,252 82,252"
        stroke="white" strokeWidth="2" strokeLinecap="round" fill="none"
      />

      {/* 右侧头发大块 */}
      <path
        d="M152,66 Q168,58 176,72 Q186,90 184,120 Q184,150 182,178 Q180,200 174,220 Q168,238 164,250 Q156,258 150,256"
        stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"
      />
      {/* 右侧头发内侧 */}
      <path
        d="M152,66 Q158,80 162,100 Q164,120 164,140"
        stroke="white" strokeWidth="1.5" strokeLinecap="round" fill="none" style={{ opacity: 0.5 }}
      />
      {/* 右侧发尾 */}
      <path
        d="M174,220 Q178,232 172,244 Q166,252 158,252"
        stroke="white" strokeWidth="2" strokeLinecap="round" fill="none"
      />

      {/* 头顶发际线（中分，微微拱） */}
      <path d="M88,66 Q104,48 120,46 Q136,48 152,66"
        stroke="white" strokeWidth="2.5" strokeLinecap="round" fill="none"
      />
      {/* 中分线（极淡） */}
      <line x1="120" y1="46" x2="120" y2="66" stroke="white" strokeWidth="0.8" style={{ opacity: 0.2 }} />

      {/* 发丝细节（左侧几根） */}
      <path d="M80,90 Q76,110 76,130" stroke="white" strokeWidth="0.8" strokeLinecap="round" fill="none" style={{ opacity: 0.3 }} />
      <path d="M84,82 Q80,100 80,120" stroke="white" strokeWidth="0.7" strokeLinecap="round" fill="none" style={{ opacity: 0.22 }} />
      {/* 发丝细节（右侧几根） */}
      <path d="M160,90 Q164,110 164,130" stroke="white" strokeWidth="0.8" strokeLinecap="round" fill="none" style={{ opacity: 0.3 }} />
      <path d="M156,82 Q160,100 160,120" stroke="white" strokeWidth="0.7" strokeLinecap="round" fill="none" style={{ opacity: 0.22 }} />

      {/* ── 耳朵 ── */}
      <path d="M76,136 Q68,140 68,150 Q68,160 76,163" stroke="white" strokeWidth="1.8" strokeLinecap="round" fill="none" />
      <path d="M164,136 Q172,140 172,150 Q172,160 164,163" stroke="white" strokeWidth="1.8" strokeLinecap="round" fill="none" />

      {/* ── 眉毛（参考图：短平眉）── */}
      <path d="M92,112 Q104,108 116,110" stroke="white" strokeWidth="2" strokeLinecap="round" fill="none" />
      <path d="M124,110 Q136,108 148,112" stroke="white" strokeWidth="2" strokeLinecap="round" fill="none" />

      {/* ── 眼镜（细框圆框，参考图）── */}
      {/* 左镜框 - 圆形偏方 */}
      <rect x="86" y="118" width="38" height="26" rx="11" ry="10"
        stroke="white" strokeWidth="1.8" fill="none" />
      {/* 右镜框 */}
      <rect x="136" y="118" width="38" height="26" rx="11" ry="10"
        stroke="white" strokeWidth="1.8" fill="none" />
      {/* 镜桥（细） */}
      <path d="M124,130 Q130,127 136,130" stroke="white" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      {/* 镜腿 */}
      <path d="M86,124 Q78,122 74,126" stroke="white" strokeWidth="1.6" strokeLinecap="round" fill="none" />
      <path d="M174,124 Q182,122 166,126" stroke="white" strokeWidth="1.6" strokeLinecap="round" fill="none" />

      {/* ── 眼睛（下垂半睁）── */}
      {/* 左眼：上眼睑弧度向下垂 */}
      <path d="M90,128 Q105,122 122,128" stroke="white" strokeWidth="2" strokeLinecap="round" fill="none" />
      {/* 左眼：下眼睑（贴近，眼缝窄） */}
      <path d="M92,132 Q105,135 120,132" stroke="white" strokeWidth="1.4" strokeLinecap="round" fill="none" />
      {/* 左眼珠（偏下，体现下垂感） */}
      <circle cx="106" cy="130" r="4.5" stroke="white" strokeWidth="1.4" fill="none" />
      <circle cx="106" cy="131" r="2" fill="white" />
      {/* 左眼高光 */}
      <circle cx="108" cy="128" r="1" fill="white" style={{ opacity: 0.6 }} />

      {/* 右眼：上眼睑 */}
      <path d="M140,128 Q155,122 172,128" stroke="white" strokeWidth="2" strokeLinecap="round" fill="none" />
      {/* 右眼：下眼睑 */}
      <path d="M142,132 Q155,135 170,132" stroke="white" strokeWidth="1.4" strokeLinecap="round" fill="none" />
      {/* 右眼珠 */}
      <circle cx="156" cy="130" r="4.5" stroke="white" strokeWidth="1.4" fill="none" />
      <circle cx="156" cy="131" r="2" fill="white" />
      {/* 右眼高光 */}
      <circle cx="158" cy="128" r="1" fill="white" style={{ opacity: 0.6 }} />

      {/* ── 腮红（参考图：大面积圆形腮红）── */}
      {/* 左腮红 */}
      {[...Array(8)].map((_, i) => (
        <circle key={`lb${i}`}
          cx={88 + (i % 3) * 5 - 5}
          cy={160 + Math.floor(i / 3) * 5}
          r={1.2}
          fill="white"
          style={{ opacity: 0.08 + i * 0.01 }}
        />
      ))}
      {/* 右腮红 */}
      {[...Array(8)].map((_, i) => (
        <circle key={`rb${i}`}
          cx={148 + (i % 3) * 5 - 5}
          cy={160 + Math.floor(i / 3) * 5}
          r={1.2}
          fill="white"
          style={{ opacity: 0.08 + i * 0.01 }}
        />
      ))}

      {/* ── 鼻子（极简小三角/点）── */}
      <circle cx="120" cy="166" r="1.8" stroke="white" strokeWidth="1.2" fill="none" style={{ opacity: 0.65 }} />

      {/* ── 嘴（微撇，参考图）── */}
      <path d="M108,190 Q114,187 120,189 Q126,187 132,190" stroke="white" strokeWidth="1.8" strokeLinecap="round" fill="none" />
      {/* 下嘴唇（稍厚） */}
      <path d="M110,192 Q120,196 130,192" stroke="white" strokeWidth="1.4" strokeLinecap="round" fill="none" style={{ opacity: 0.55 }} />
    </svg>
  );
}

// ============================================================
// 对话气泡组件
// ============================================================
function SpeechBubble({ text, visible, isTyping = false, typedText = '' }) {
  if (!visible && !isTyping) return null;
  const displayText = isTyping ? typedText : text;
  return (
    <div
      className={`speech-bubble jitter-text transition-opacity duration-500 ${visible || isTyping ? 'opacity-100' : 'opacity-0'}`}
      style={{ whiteSpace: 'pre-wrap', minWidth: '120px', maxWidth: '260px', lineHeight: 1.6 }}
    >
      {displayText}
      {isTyping && <span className="typewriter-cursor" />}
    </div>
  );
}

// ============================================================
// 标签 — 固定坐标，围绕头像外侧，全部保持可见
// 头像中心约在容器 (0, 0)，头像尺寸 240×320
// 标签不覆盖面部区域（大致 x: -80~80, y: -60~120）
// ============================================================
const TAG_POSITIONS = [
  // ── 正上方（发顶以上） ──
  { x:  -16, y: -205, delay: 0.0 },
  // ── 左上 ──
  { x: -195, y: -170, delay: 0.5 },
  // ── 左侧高 ──
  { x: -210, y:  -60, delay: 1.0 },
  // ── 左侧中 ──
  { x: -205, y:   50, delay: 1.5 },
  // ── 左下（肩部以外） ──
  { x: -170, y:  155, delay: 2.0 },
  // ── 右上 ──
  { x:  130, y: -170, delay: 2.5 },
  // ── 右侧高 ──
  { x:  150, y:  -60, delay: 3.0 },
  // ── 右侧中 ──
  { x:  145, y:   50, delay: 3.5 },
  // ── 右下（肩部以外） ──
  { x:  110, y:  155, delay: 4.0 },
];

const TAGS = [
  '台州市热心市民',
  '美团点评产品人',
  '沪漂研究生',
  '自我矛盾界先驱',
  '诺贝尔文学奖读者',
  '网易云黑胶五级VIP',
  '讨厌夏天第一人',
  '抹茶杀手',
  '咖啡严重依赖患者',
];

// 每个标签的尾巴指向头像中心
function TagBubble({ text, position, visible }) {
  const isLeft = position.x < 0;

  return (
    <div
      className="absolute"
      style={{
        left: '50%',
        top: '50%',
        // translate 使标签以其自身中心定位
        transform: `translate(calc(-50% + ${position.x}px), calc(-50% + ${position.y}px))`,
        opacity: 0,
        animation: visible
          ? `tagPop 0.38s cubic-bezier(0.175,0.885,0.32,1.275) ${position.delay}s forwards`
          : 'none',
        zIndex: 5,
        pointerEvents: 'none',
      }}
    >
      <div
        style={{
          fontFamily: "'Caveat', cursive",
          fontSize: '0.88rem',
          padding: '5px 12px',
          whiteSpace: 'nowrap',
          background: '#000',
          color: '#FFF',
          border: '1.5px solid rgba(255,255,255,0.85)',
          borderRadius: '3px',
          boxShadow: '1px 1px 0 rgba(255,255,255,0.12), -1px -1px 0 rgba(255,255,255,0.08)',
          position: 'relative',
        }}
      >
        {text}
        {/* 手绘边框副线 */}
        <div style={{
          position: 'absolute', inset: '-3px',
          border: '1px solid rgba(255,255,255,0.2)',
          borderRadius: '4px',
          transform: 'rotate(-0.4deg)',
          pointerEvents: 'none',
        }} />
      </div>
    </div>
  );
}

// ============================================================
// 手绘正方体按钮 SVG
// ============================================================
function CubeButton({ onClick }) {
  return (
    <div
      className="flex flex-col items-center gap-1 cursor-pointer group"
      onClick={onClick}
      style={{ userSelect: 'none' }}
    >
      <svg
        width="48" height="48" viewBox="0 0 56 52" fill="none"
        className="jitter-svg group-hover:opacity-70 transition-opacity"
        style={{ filter: 'url(#sketchy)' }}
        aria-label="打开对话"
      >
        {/* 等轴正视图正方体（无透视） */}
        {/* 顶面菱形 */}
        <polygon points="28,4 50,14 28,24 6,14"
          stroke="white" strokeWidth="1.8" strokeLinejoin="round" fill="none" />
        {/* 左面 */}
        <polygon points="6,14 6,40 28,50 28,24"
          stroke="white" strokeWidth="1.8" strokeLinejoin="round" fill="none" />
        {/* 右面 */}
        <polygon points="50,14 50,40 28,50 28,24"
          stroke="white" strokeWidth="1.8" strokeLinejoin="round" fill="none" />
        {/* 中轴线（装饰） */}
        <line x1="28" y1="4" x2="28" y2="50" stroke="white" strokeWidth="0.5" style={{ opacity: 0.2 }} />
      </svg>
      <span
        className="jitter-text group-hover:opacity-60 transition-opacity"
        style={{ fontFamily: "'Caveat', cursive", fontSize: '0.72rem', opacity: 0.4, letterSpacing: '0.06em' }}
      >
        问问我
      </span>
    </div>
  );
}

// ============================================================
// Coze API 调用（流式）
// ============================================================
const COZE_API_TOKEN = 'YOUR_COZE_API_TOKEN';
const COZE_BOT_ID   = 'YOUR_COZE_BOT_ID';

async function callCozeStreaming(userInput, onChunk, onDone, onError) {
  try {
    const response = await fetch('https://api.coze.cn/v3/chat', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${COZE_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        bot_id: COZE_BOT_ID,
        user_id: 'shuyu_visitor',
        stream: true,
        auto_save_history: false,
        additional_messages: [{ role: 'user', content: userInput, content_type: 'text' }],
      }),
    });
    if (!response.ok) { onError('API 请求失败，请稍后重试。'); return; }

    const reader = response.body.getReader();
    const decoder = new TextDecoder('utf-8');
    let buffer = '';
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';
      for (const line of lines) {
        if (line.startsWith('data:')) {
          const jsonStr = line.slice(5).trim();
          if (!jsonStr || jsonStr === '[DONE]') continue;
          try {
            const parsed = JSON.parse(jsonStr);
            if (parsed.type === 'answer' && parsed.content) onChunk(parsed.content);
            if (parsed.type === 'done') onDone();
          } catch { /* 忽略 */ }
        }
      }
    }
    onDone();
  } catch {
    onError('网络错误，请检查连接。');
  }
}

// ============================================================
// HomePage 主组件
// ============================================================
export default function HomePage() {
  const [introVisible, setIntroVisible] = useState(true);
  const [tagsVisible,  setTagsVisible]  = useState(false);
  const [cubeMode,     setCubeMode]     = useState(false);
  const [inputValue,   setInputValue]   = useState('');
  const [aiAnswer,     setAiAnswer]     = useState('');
  const [isStreaming,  setIsStreaming]   = useState(false);
  const [aiVisible,    setAiVisible]    = useState(false);

  const introTimerRef = useRef(null);
  const inputRef      = useRef(null);

  // 5秒后淡出介绍气泡
  useEffect(() => {
    introTimerRef.current = setTimeout(() => setIntroVisible(false), 5000);
    return () => clearTimeout(introTimerRef.current);
  }, []);

  const handleAvatarClick = useCallback(() => {
    if (cubeMode) return;
    clearTimeout(introTimerRef.current);
    setIntroVisible(false);
    setAiVisible(false);
    setAiAnswer('');
    // 重置再触发，确保动画重新播放
    setTagsVisible(false);
    setTimeout(() => setTagsVisible(true), 50);
  }, [cubeMode]);

  const handleCubeClick = useCallback(() => {
    setTagsVisible(false);
    setIntroVisible(false);
    setCubeMode(true);
    setAiAnswer('');
    setAiVisible(true);
    setTimeout(() => inputRef.current?.focus(), 300);
  }, []);

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    if (!inputValue.trim() || isStreaming) return;
    const question = inputValue.trim();
    setInputValue('');
    setAiAnswer('');
    setIsStreaming(true);
    callCozeStreaming(
      question,
      (chunk) => setAiAnswer(prev => prev + chunk),
      () => setIsStreaming(false),
      (err)  => { setAiAnswer(err); setIsStreaming(false); }
    );
  }, [inputValue, isStreaming]);

  const bubbleText = cubeMode
    ? (aiAnswer || (isStreaming ? '' : '怎么了？'))
    : '我是舒予。';
  const bubbleVisible = cubeMode ? aiVisible : introVisible;

  return (
    <div className="relative w-full h-full flex flex-col items-center overflow-hidden">
      {/* SVG 全局滤镜 */}
      <svg width="0" height="0" className="absolute pointer-events-none">
        <defs>
          <filter id="sketchy" x="-5%" y="-5%" width="110%" height="110%">
            <feTurbulence type="fractalNoise" baseFrequency="0.065" numOctaves="2" seed="5" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="1.5" xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>
      </svg>

      {/* ── 主舞台（撑满中间区域，底部留给正方体）── */}
      <div
        className="relative flex items-center justify-center flex-1 w-full"
        style={{ minHeight: 0 }}
      >
        {/* 中心定位锚点（头像中心） */}
        <div className="relative" style={{ width: 0, height: 0 }}>

          {/* ── 头像（以锚点为中心）── */}
          <div
            className="absolute z-10"
            style={{ width: 240, height: 320, left: -120, top: -160 }}
          >
            <AvatarSVG onClick={handleAvatarClick} />
          </div>

          {/* ── 介绍/AI 气泡（头像右上方）── */}
          <div
            className="absolute z-20 transition-all duration-500"
            style={{
              right: -150,
              top: -200,
              opacity: bubbleVisible || (isStreaming && cubeMode) ? 1 : 0,
              transform: bubbleVisible || (isStreaming && cubeMode) ? 'scale(1) translateY(0)' : 'scale(0.85) translateY(6px)',
              pointerEvents: 'none',
              maxWidth: 260,
            }}
          >
            <SpeechBubble
              text={bubbleText}
              visible={bubbleVisible}
              isTyping={isStreaming && cubeMode}
              typedText={aiAnswer}
            />
          </div>

          {/* ── 9 个标签（头像外侧，保持可见）── */}
          {TAGS.map((tag, i) => (
            <TagBubble
              key={`${tag}-${tagsVisible}`}
              text={tag}
              position={TAG_POSITIONS[i]}
              visible={tagsVisible}
            />
          ))}
        </div>
      </div>

      {/* ── 底部行：AI 输入框 + 正方体（与导航栏同高度）── */}
      <div
        className="w-full flex items-end justify-end px-12"
        style={{ height: 72, paddingBottom: 16, position: 'relative', zIndex: 30 }}
      >
        {/* AI 输入框（cubeMode 时展开） */}
        <div
          style={{
            overflow: 'hidden',
            maxWidth: cubeMode ? 280 : 0,
            opacity: cubeMode ? 1 : 0,
            transition: 'max-width 0.4s ease, opacity 0.3s ease',
            marginRight: 16,
          }}
        >
          <form
            onSubmit={handleSubmit}
            className="flex items-center gap-2 sketch-border px-3 py-2"
            style={{ background: '#000', width: 280 }}
          >
            <input
              ref={inputRef}
              type="text"
              className="sketch-input flex-1"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="输入你想问的…"
              disabled={isStreaming}
              maxLength={200}
              style={{ fontSize: '1rem' }}
            />
            <button
              type="submit"
              disabled={isStreaming || !inputValue.trim()}
              className="bg-transparent border-none text-white/60 hover:text-white transition-colors cursor-pointer"
              style={{ fontFamily: "'Caveat', cursive", fontSize: '1.2rem' }}
            >
              →
            </button>
          </form>
        </div>

        {/* 正方体按钮 */}
        <CubeButton onClick={handleCubeClick} />
      </div>

      {/* ── 角落装饰文字 ── */}
      <div
        className="absolute top-8 left-12 jitter-text pointer-events-none"
        style={{ fontFamily: "'Special Elite', monospace", fontSize: '0.65rem', color: 'rgba(255,255,255,0.1)', letterSpacing: '0.18em' }}
      >
        SHUYU · 2002 · TAIZHOU
      </div>
      <div
        className="absolute top-8 right-12 jitter-text pointer-events-none"
        style={{ fontFamily: "'Special Elite', monospace", fontSize: '0.65rem', color: 'rgba(255,255,255,0.1)', letterSpacing: '0.1em', textAlign: 'right' }}
      >
        CLICK TO KNOW MORE
      </div>
    </div>
  );
}
