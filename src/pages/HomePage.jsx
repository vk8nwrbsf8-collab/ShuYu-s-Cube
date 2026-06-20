/**
 * HomePage - 【I】首页
 *
 * 布局方案：
 *   - 正方体用 200×200px 的 div 居中放置
 *   - 外层套一个 560×560 的相对定位容器，作为标签的定位父元素
 *   - 标签用 absolute + 精确的 top/left/right/bottom 定位在容器内
 *   - 正方体在容器正中心 (left:180, top:180)
 *
 * 正方体尺寸：200px，容器 560×480
 * 正方体中心在容器内: cx=280, cy=240
 * 标签距正方体边缘约 20~40px 的间距
 */
import { useState, useEffect, useRef, useCallback, useMemo } from 'react';

// 获取窗口尺寸
function useWindowSize() {
  const [size, setSize] = useState({ w: window.innerWidth, h: window.innerHeight });
  useEffect(() => {
    const handler = () => setSize({ w: window.innerWidth, h: window.innerHeight });
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);
  return size;
}

// ─────────────────────────────────────────────
// CSS 关键帧（动态注入避免 Tailwind 冲突）
// ─────────────────────────────────────────────
const GLOBAL_STYLES = `
  @keyframes cubeRotate {
    from { transform: rotateX(-22deg) rotateY(0deg); }
    to   { transform: rotateX(-22deg) rotateY(360deg); }
  }
  @keyframes tagAppear {
    0%   { opacity: 0; transform: scale(0.3) rotate(var(--r, 0deg)); }
    65%  { transform: scale(1.1) rotate(var(--r, 0deg)); }
    100% { opacity: 1; transform: scale(1) rotate(var(--r, 0deg)); }
  }
  /* 各档颤动：频率/幅度各异，模拟手持便利贴 */
  @keyframes tagJitter0 {
    0%,100%{ transform: rotate(var(--r,0deg)) translate(0px,0px); }
    20%   { transform: rotate(calc(var(--r,0deg) + 0.5deg)) translate(0.4px,-0.3px); }
    40%   { transform: rotate(calc(var(--r,0deg) - 0.4deg)) translate(-0.3px,0.4px); }
    60%   { transform: rotate(calc(var(--r,0deg) + 0.3deg)) translate(0.3px,0.3px); }
    80%   { transform: rotate(calc(var(--r,0deg) - 0.5deg)) translate(-0.4px,-0.2px); }
  }
  @keyframes tagJitter1 {
    0%,100%{ transform: rotate(var(--r,0deg)) translate(0px,0px); }
    25%   { transform: rotate(calc(var(--r,0deg) - 0.6deg)) translate(0.5px,0.3px); }
    50%   { transform: rotate(calc(var(--r,0deg) + 0.4deg)) translate(-0.4px,-0.4px); }
    75%   { transform: rotate(calc(var(--r,0deg) - 0.3deg)) translate(0.3px,-0.3px); }
  }
  @keyframes tagJitter2 {
    0%,100%{ transform: rotate(var(--r,0deg)) translate(0px,0px); }
    33%   { transform: rotate(calc(var(--r,0deg) + 0.7deg)) translate(-0.5px,0.5px); }
    66%   { transform: rotate(calc(var(--r,0deg) - 0.5deg)) translate(0.4px,-0.5px); }
  }
  @keyframes tagJitter3 {
    0%,100%{ transform: rotate(var(--r,0deg)) translate(0px,0px); }
    20%   { transform: rotate(calc(var(--r,0deg) + 0.4deg)) translate(0.6px,0.2px); }
    45%   { transform: rotate(calc(var(--r,0deg) - 0.6deg)) translate(-0.3px,0.5px); }
    70%   { transform: rotate(calc(var(--r,0deg) + 0.3deg)) translate(0.2px,-0.4px); }
    90%   { transform: rotate(calc(var(--r,0deg) - 0.2deg)) translate(-0.4px,0.3px); }
  }
`;

// ─────────────────────────────────────────────
// 旋转 3D 线框正方体
// ─────────────────────────────────────────────
function RotatingCube({ onClick, size = 200 }) {
  const h = size / 2;
  const faces = [
    { t: `translateZ(${h}px)` },
    { t: `rotateY(180deg) translateZ(${h}px)` },
    { t: `rotateY(-90deg) translateZ(${h}px)` },
    { t: `rotateY(90deg) translateZ(${h}px)` },
    { t: `rotateX(90deg) translateZ(${h}px)` },
    { t: `rotateX(-90deg) translateZ(${h}px)` },
  ];
  return (
    <div
      onClick={onClick}
      style={{ width: size, height: size, perspective: 700, cursor: 'pointer', flexShrink: 0 }}
    >
      <div style={{
        width: size, height: size,
        position: 'relative',
        transformStyle: 'preserve-3d',
        animation: 'cubeRotate 9s linear infinite',
        willChange: 'transform',
      }}>
        {faces.map(({ t }, i) => (
          <div key={i} style={{
            position: 'absolute', inset: 0,
            transform: t,
            border: '1.8px solid rgba(255,255,255,0.8)',
            background: 'transparent',
          }}>
            {/* 面内对角线 */}
            <svg style={{ position:'absolute', inset:0, width:'100%', height:'100%', opacity:0.12 }}>
              <line x1="0" y1="0" x2={size} y2={size} stroke="white" strokeWidth="1" />
              <line x1={size} y1="0" x2="0" y2={size} stroke="white" strokeWidth="1" />
            </svg>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// 对话气泡
// ─────────────────────────────────────────────
function SpeechBubble({ text, visible, isTyping = false, typedText = '' }) {
  const show = visible || isTyping;
  return (
    <div style={{
      opacity: show ? 1 : 0,
      transform: show ? 'scale(1) translateY(0)' : 'scale(0.9) translateY(6px)',
      transition: 'opacity 0.4s ease, transform 0.4s ease',
      pointerEvents: 'none',
      fontFamily: "'Caveat', cursive",
      fontSize: '1.08rem',
      padding: '10px 16px',
      border: '1.5px solid rgba(255,255,255,0.85)',
      borderRadius: '10px',
      background: '#000',
      color: '#fff',
      whiteSpace: 'pre-wrap',
      maxWidth: 220,
      lineHeight: 1.6,
      position: 'relative',
    }}>
      {isTyping ? typedText : (show ? text : '')}
      {isTyping && <span className="typewriter-cursor" />}
      {/* 尾巴 */}
      <svg style={{ position:'absolute', bottom:-11, left:18 }}
        width="14" height="12" viewBox="0 0 14 12" fill="none">
        <path d="M1,0 L0,12 L13,2" stroke="white" strokeWidth="1.5"
          strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </svg>
    </div>
  );
}

// ─────────────────────────────────────────────
// 标签
// ─────────────────────────────────────────────
// 容器 700×560，正方体 200×200 居中 left:250, top:180
// 正方体视觉中心约 (350, 280)，视觉边界约：左230 右470 上155 下405
// 9 个标签均匀围绕四周：上3 / 左2 / 右2 / 下2
// 每个标签保持独立旋转角和颤动档，高低微错落保留凌乱感
//
// rot:    静止旋转角（deg），标签天然歪斜
// jitter: 颤动动画档位 (0-3)，各档频率不同
// dur:    颤动周期
// 容器 720×640，正方体居中偏下15px: left=260, top=235，正方体中心 cx=360, cy=335
// 10 个标签以 (360,335) 为圆心，半径 r=250，每隔 36° 均匀分布
// raw_x = 360 + 250*cosθ,  raw_y = 335 + 250*sinθ
// left  = raw_x - 标签半宽补偿,  top = raw_y - 12
const TAG_DEFS = [
  // θ=-90°  正上方      raw(360,  85)
  { text: '沪漂研究生',         rot:  1,  jitter: 2, dur: '0.12s', style: { top:  61, left: 324 } },
  // θ=-54°  右上偏上    raw(507, 133)
  { text: '网易云黑胶五级VIP',  rot: -3,  jitter: 3, dur: '0.14s', style: { top: 109, left: 436 } },
  // θ=-18°  右偏上      raw(598, 258)
  { text: '被逼PDE的产品经理',  rot: -2,  jitter: 0, dur: '0.11s', style: { top: 234, left: 503 } },
  // θ=18°   右偏下      raw(598, 412)
  { text: '讨厌夏天第一人',     rot:  3,  jitter: 0, dur: '0.08s', style: { top: 388, left: 524 } },
  // θ=54°   右下偏下    raw(507, 537)
  { text: '咖啡严重依赖患者',   rot:  2,  jitter: 2, dur: '0.11s', style: { top: 513, left: 428 } },
  // θ=90°   正下方      raw(360, 585)
  { text: '抹茶杀手',           rot: -4,  jitter: 3, dur: '0.10s', style: { top: 561, left: 326 } },
  // θ=126°  左下偏下    raw(213, 537)
  { text: '诺贝尔文学奖读者',   rot:  3,  jitter: 1, dur: '0.13s', style: { top: 513, left: 118 } },
  // θ=162°  左偏下      raw(122, 412)
  { text: 'AI Coder',           rot:  3,  jitter: 1, dur: '0.09s', style: { top: 388, left:  92 } },
  // θ=198°  左偏上      raw(122, 258)
  { text: '自我矛盾界先驱',     rot: -2,  jitter: 2, dur: '0.09s', style: { top: 234, left:  56 } },
  // θ=234°  左上偏上    raw(213, 133)
  { text: '台州市热心市民',     rot: -3,  jitter: 0, dur: '0.11s', style: { top: 109, left: 150 } },
];

function TagLabel({ text, rot, jitter, dur, style, delay, tagKey, onDismiss, allShown }) {
  const jitterName = `tagJitter${jitter}`;
  const elRef = useRef(null);
  const dismissedRef = useRef(false);

  const handleClick = () => {
    if (!allShown || dismissedRef.current) return;
    dismissedRef.current = true;
    const el = elRef.current;
    if (!el) return;
    // 直接操作 DOM：叠加淡出过渡，不打断正在运行的颤动 animation
    el.style.transition = 'opacity 0.28s ease';
    el.style.opacity = '0';
    setTimeout(() => onDismiss?.(), 300);
  };

  return (
    <div
      ref={elRef}
      key={`${tagKey}-${text}`}
      onClick={handleClick}
      style={{
        position: 'absolute',
        ...style,
        zIndex: 20,
        pointerEvents: allShown ? 'auto' : 'none',
        opacity: 0,
        cursor: allShown ? 'pointer' : 'default',
        // 先做弹出动画，结束后 onAnimationEnd 切换为颤动
        animation: `tagAppear 0.42s cubic-bezier(0.175,0.885,0.32,1.275) ${delay}s forwards`,
        willChange: 'transform, opacity',
        '--r': `${rot}deg`,
      }}
      // 弹出动画结束后换成颤动动画
      onAnimationEnd={(e) => {
        if (e.animationName === 'tagAppear') {
          e.currentTarget.style.animation = `${jitterName} ${dur} ease-in-out infinite`;
          e.currentTarget.style.opacity = '1';
        }
      }}
    >
      <div style={{
        fontFamily: "'Caveat', cursive",
        fontSize: '0.88rem',
        padding: '5px 13px',
        whiteSpace: 'nowrap',
        background: '#000',
        color: '#fff',
        border: '1.5px solid rgba(255,255,255,0.82)',
        borderRadius: '3px',
        position: 'relative',
        lineHeight: 1.45,
      }}>
        {text}
        {/* 手绘副笔（微偏移） */}
        <div style={{
          position: 'absolute', inset: '-3px',
          border: '1px solid rgba(255,255,255,0.16)',
          borderRadius: '4px',
          transform: `rotate(${-rot * 0.6}deg)`,
          pointerEvents: 'none',
        }} />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// 右下角小正方体按钮
// ─────────────────────────────────────────────
function SmallCubeBtn({ onClick }) {
  return (
    <div className="flex flex-col items-center gap-1 cursor-pointer group"
      onClick={onClick} style={{ userSelect: 'none' }}>
      <svg width="40" height="40" viewBox="0 0 56 52" fill="none"
        className="jitter-svg group-hover:opacity-60 transition-opacity duration-200"
        style={{ filter: 'url(#sketchy)' }}>
        <polygon points="28,4 50,14 28,24 6,14"
          stroke="white" strokeWidth="1.8" strokeLinejoin="round" fill="none" />
        <polygon points="6,14 6,40 28,50 28,24"
          stroke="white" strokeWidth="1.8" strokeLinejoin="round" fill="none" />
        <polygon points="50,14 50,40 28,50 28,24"
          stroke="white" strokeWidth="1.8" strokeLinejoin="round" fill="none" />
      </svg>
    </div>
  );
}

// ─────────────────────────────────────────────
// Agent API  (Coze.cn 官方 Bot API v3/chat)
// ─────────────────────────────────────────────
// 开发环境走 Vite 代理（/coze-api -> https://api.coze.cn）避免 CORS
// 生产环境走 Cloudflare Worker，由服务端代理注入 Coze PAT
const DEFAULT_AGENT_BOT_ID = '7651604061602611200';
const AGENT_API_URL = import.meta.env.VITE_COZE_API_URL || (import.meta.env.DEV
  ? '/coze-api/v3/chat'
  : 'https://coze-cors-proxy.vk8nwrbsf8.workers.dev/v3/chat');
const AGENT_BOT_ID = import.meta.env.VITE_COZE_BOT_ID || DEFAULT_AGENT_BOT_ID;
const AGENT_USER_ID_KEY = 'shuyu_cube_agent_user_id';

function getAgentUserId() {
  if (typeof window === 'undefined') return 'visitor_server';
  try {
    const existing = window.localStorage.getItem(AGENT_USER_ID_KEY);
    if (existing) return existing;
    const id = `visitor_${window.crypto?.randomUUID?.() || Math.random().toString(36).slice(2, 12)}`;
    window.localStorage.setItem(AGENT_USER_ID_KEY, id);
    return id;
  } catch {
    return 'visitor_' + Math.random().toString(36).slice(2, 10);
  }
}

async function callAgentStreaming(text, onChunk, onDone, onError) {
  let gotAnswer = false;
  let finished = false;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 45000);

  const formatApiError = (payload, fallback = 'Agent 连接失败，可以稍后再试～') => {
    if (!payload) return fallback;
    const code = payload.code ?? payload.error_code ?? payload.status;
    const message = payload.msg || payload.message || payload.error || payload.detail?.message || '';
    if (code === 4101 || /token|auth|authorization/i.test(String(message))) {
      return 'Agent 认证失败：令牌无效或已过期。';
    }
    if (/Missing COZE_PAT/i.test(String(message))) {
      return 'Agent 代理还没有配置 Coze 令牌。';
    }
    return message ? `Agent 请求失败：${message}` : fallback;
  };

  const emitChunk = (chunk) => {
    if (!chunk) return;
    gotAnswer = true;
    onChunk(chunk);
  };

  const finish = () => {
    if (finished) return;
    finished = true;
    clearTimeout(timeout);
    if (!gotAnswer) {
      onError('暂时没有收到回复，可以再试一次～');
      return;
    }
    onDone();
  };

  const extractAnswer = (payload) => {
    if (!payload || payload.type !== 'answer') return '';
    if (typeof payload.content === 'string') return payload.content;
    if (typeof payload.content?.answer === 'string') return payload.content.answer;
    return '';
  };

  try {
    const res = await fetch(AGENT_API_URL, {
      method: 'POST',
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'text/event-stream',
      },
      body: JSON.stringify({
        bot_id: AGENT_BOT_ID,
        user_id: getAgentUserId(),
        stream: true,
        additional_messages: [
          { role: 'user', content: text, content_type: 'text' },
        ],
      }),
    });
    if (!res.ok) {
      clearTimeout(timeout);
      const errText = await res.text();
      try {
        onError(formatApiError(JSON.parse(errText), `请求失败 (${res.status})`));
      } catch {
        onError(`请求失败 (${res.status}): ${errText.slice(0, 150)}`);
      }
      return;
    }

    const contentType = res.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      clearTimeout(timeout);
      const payload = await res.json().catch(() => null);
      onError(formatApiError(payload));
      return;
    }

    const reader = res.body.getReader();
    const dec = new TextDecoder('utf-8');
    let buf = '';
    // Coze v3/chat SSE 格式：
    //   event: conversation.message.delta
    //   data: {"role":"assistant","type":"answer","content":"...", ...}
    //
    //   event: conversation.chat.completed
    //   data: {"status":"completed", ...}
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buf += dec.decode(value, { stream: true });
      const blocks = buf.split('\n\n');
      buf = blocks.pop() ?? '';
      for (const block of blocks) {
        const lines = block.split('\n');
        let eventType = '';
        let dataStr = '';
        for (const ln of lines) {
          if (ln.startsWith('event:')) eventType = ln.slice(6).trim();
          if (ln.startsWith('data:'))  dataStr  = ln.slice(5).trim();
        }
        if (!dataStr || dataStr === '[DONE]') continue;
        try {
          const p = JSON.parse(dataStr);
          // Coze v3 流式文字块
          if (eventType === 'conversation.message.delta') {
            emitChunk(extractAnswer(p));
            continue;
          }
          // Coze v3 有时只在 completed 事件里给完整答案
          if (eventType === 'conversation.message.completed' && !gotAnswer) {
            emitChunk(extractAnswer(p));
          }
          // 兼容旧版/代理转写格式
          if (!eventType || eventType === 'message') {
            emitChunk(extractAnswer(p));
          }
          // 会话完成
          if (eventType === 'conversation.chat.completed' || eventType === 'done') {
            finish();
            return;
          }
        } catch { /* 忽略解析失败的行 */ }
      }
    }
    finish();
  } catch (e) {
    clearTimeout(timeout);
    onError(e.name === 'AbortError'
      ? '连接超时了，可以再试一次～'
      : '网络错误：' + e.message);
  }
}

// ─────────────────────────────────────────────
// 浮动聊天面板（自定义 UI，黑底白字手绘风）
// ─────────────────────────────────────────────
function CozeChatPanel({ open, onClose }) {
  const [messages,    setMessages]    = useState([]); // [{role:'user'|'ai', text}]
  const [inputValue,  setInputValue]  = useState('');
  const [isStreaming, setIsStreaming]  = useState(false);
  const inputRef   = useRef(null);
  const scrollRef  = useRef(null);
  const FONT = "'Caveat', cursive";

  // 面板打开时自动 focus
  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 260);
  }, [open]);

  // 新消息后滚到底部
  useEffect(() => {
    if (scrollRef.current)
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const q = inputValue.trim();
    if (!q || isStreaming) return;
    setInputValue('');
    // 追加用户消息
    setMessages(prev => [...prev, { role: 'user', text: q }]);
    // 追加 AI 占位
    setMessages(prev => [...prev, { role: 'ai', text: '' }]);
    setIsStreaming(true);
    callAgentStreaming(
      q,
      chunk => setMessages(prev => {
        const arr = [...prev];
        arr[arr.length - 1] = { role: 'ai', text: arr[arr.length - 1].text + chunk };
        return arr;
      }),
      () => setIsStreaming(false),
      err => {
        setMessages(prev => {
          const arr = [...prev];
          arr[arr.length - 1] = { role: 'ai', text: err };
          return arr;
        });
        setIsStreaming(false);
      },
    );
  };

  // 移动端留边，桌面端浮动
  const isMobile = window.innerWidth <= 640;
  const panelStyle = isMobile ? {
    position: 'fixed',
    top: 72,
    right: 26,
    bottom: 88,
    left: 26,
    zIndex: 9998,
    display: 'flex',
    flexDirection: 'column',
    transform: open ? 'translateY(0)' : 'translateY(18px)',
    opacity: open ? 1 : 0,
    pointerEvents: open ? 'auto' : 'none',
    transition: 'transform 0.32s cubic-bezier(0.32,0.72,0,1), opacity 0.22s ease',
  } : {
    position: 'fixed',
    bottom: 120,
    right: 120,
    width: 300,
    height: 500,
    zIndex: 9998,
    display: 'flex',
    flexDirection: 'column',
    transform: open ? 'scale(1) translateY(0)' : 'scale(0.92) translateY(16px)',
    opacity: open ? 1 : 0,
    pointerEvents: open ? 'auto' : 'none',
    transition: 'transform 0.28s cubic-bezier(0.34,1.56,0.64,1), opacity 0.22s ease',
    transformOrigin: 'bottom right',
  };

  return (
    <div style={panelStyle}
    >
      {/* 外框：手绘感多层边框 */}
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        background: '#000',
        border: '1.5px solid rgba(255,255,255,0.82)',
        borderRadius: 4,
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 0 0 1px rgba(255,255,255,0.08), 4px 4px 0 rgba(255,255,255,0.06)',
      }}>
        {/* 副笔（手绘偏移层） */}
        <div style={{
          position: 'absolute', inset: '-3px',
          border: '1px solid rgba(255,255,255,0.13)',
          borderRadius: 6,
          pointerEvents: 'none',
          transform: 'rotate(-0.3deg)',
        }} />

        <button
          onClick={onClose}
          aria-label="关闭对话"
          style={{
            position: 'absolute',
            top: 10,
            right: 10,
            zIndex: 2,
            background: 'none',
            border: 'none',
            color: 'rgba(255,255,255,0.45)',
            cursor: 'pointer',
            fontFamily: FONT,
            fontSize: '1.05rem',
            lineHeight: 1,
            padding: '2px 4px',
            transition: 'color 0.15s',
          }}
          onMouseEnter={e => e.target.style.color = '#fff'}
          onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.45)'}
        >✕</button>

        {/* 消息列表 */}
        <div
          ref={scrollRef}
          style={{
            flex: 1, overflowY: 'auto', padding: '42px 12px 12px', display: 'flex',
            flexDirection: 'column', gap: 8,
            scrollbarWidth: 'thin',
            scrollbarColor: 'rgba(255,255,255,0.2) transparent',
          }}
        >
          {messages.length === 0 && (
            <div style={{
              fontFamily: FONT, fontSize: '0.84rem', color: 'rgba(255,255,255,0.3)',
              textAlign: 'center', marginTop: 40, lineHeight: 1.8,
            }}>
              嗨，有什么想问我的？
            </div>
          )}
          {messages.map((msg, i) => (
            <div key={i} style={{
              display: 'flex',
              justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
            }}>
              <div style={{
                maxWidth: '82%',
                fontFamily: FONT,
                fontSize: '0.88rem',
                lineHeight: 1.58,
                padding: '6px 10px',
                border: '1.5px solid rgba(255,255,255,0.75)',
                borderRadius: 3,
                background: msg.role === 'user' ? 'rgba(255,255,255,0.07)' : '#000',
                color: '#fff',
                position: 'relative',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
              }}>
                {/* AI 气泡的副笔 */}
                {msg.role === 'ai' && (
                  <div style={{
                    position: 'absolute', inset: '-2px',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: 4,
                    pointerEvents: 'none',
                    transform: 'rotate(0.4deg)',
                  }} />
                )}
                {msg.text || (isStreaming && i === messages.length - 1
                  ? <span style={{ opacity: 0.4 }}>···</span>
                  : '')}
                {/* 流式打字游标 */}
                {isStreaming && i === messages.length - 1 && msg.text && (
                  <span style={{
                    display: 'inline-block', width: 2, height: '1em',
                    background: 'rgba(255,255,255,0.7)',
                    marginLeft: 2, verticalAlign: 'text-bottom',
                    animation: 'jitter 0.6s steps(1) infinite',
                  }} />
                )}
              </div>
            </div>
          ))}
        </div>

        {/* 输入框 */}
        <form
          onSubmit={handleSubmit}
          style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '7px 10px 9px',
            borderTop: '1px solid rgba(255,255,255,0.12)',
            flexShrink: 0,
          }}
        >
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            disabled={isStreaming}
            placeholder="输入你的问题…"
            maxLength={300}
            style={{
              flex: 1, background: 'transparent', border: 'none', outline: 'none',
              color: '#fff', fontFamily: FONT, fontSize: '0.9rem',
              caretColor: 'rgba(255,255,255,0.8)',
            }}
          />
          <button
            type="submit"
            disabled={isStreaming || !inputValue.trim()}
            style={{
              background: 'none', border: 'none', cursor: isStreaming || !inputValue.trim() ? 'default' : 'pointer',
              color: isStreaming || !inputValue.trim() ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.85)',
              fontFamily: FONT, fontSize: '1.15rem', lineHeight: 1,
              transition: 'color 0.15s',
              padding: '0 2px',
              flexShrink: 0,
            }}
          >→</button>
        </form>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// 主组件
// ─────────────────────────────────────────────
export default function HomePage() {
  const [tagsShown,    setTagsShown]    = useState(false);
  const [tagKey,       setTagKey]       = useState(0);
  const [visibleTags,  setVisibleTags]  = useState([]);   // 当前可见标签索引集合
  const [allShown,     setAllShown]     = useState(false); // 全部标签已出现
  const [chatOpen,     setChatOpen]     = useState(false); // Coze 面板开关
  const { w: winW, h: winH } = useWindowSize();

  // 标签全部弹出完成后标记 allShown
  useEffect(() => {
    if (!tagsShown) { setAllShown(false); return; }
    const lastDelay = (TAG_DEFS.length - 1) * 0.18 + 0.42; // 最后一个标签弹出完成
    const t = setTimeout(() => setAllShown(true), lastDelay * 1000 + 50);
    return () => clearTimeout(t);
  }, [tagsShown, tagKey]);

  // 点击大正方体 → 弹出/重置标签
  const handleCubeClick = useCallback(() => {
    setTagsShown(false);
    setAllShown(false);
    setTagKey(k => k + 1);
    requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        setTagsShown(true);
        setVisibleTags(TAG_DEFS.map((_, i) => i));
      })
    );
  }, []);

  // 点击标签 → 从可见列表移除
  const handleTagDismiss = useCallback((idx) => {
    setVisibleTags(prev => prev.filter(i => i !== idx));
  }, []);

  // 点击小正方体 → 切换 Coze 面板
  const handleSmallCubeClick = useCallback(() => {
    setChatOpen(prev => !prev);
  }, []);

      // 容器尺寸：正方体 200px，半径230，中心(350,300)
      const CONTAINER_W = 720;
      const CONTAINER_H = 640;
      const CUBE_SIZE   = 200;

      // 移动端缩放比：让容器缩放到刚好不超出屏幕（留出底部导航高度 72px）
      const availH = winH - 72;
      const scaleX = winW / CONTAINER_W;
      const scaleY = availH / CONTAINER_H;
      const containerScale = Math.min(scaleX, scaleY, 1); // 桌面端不放大，只缩小

  return (
    <div className="relative w-full h-full flex flex-col items-center overflow-hidden">

      {/* 注入全局动画 */}
      <style>{GLOBAL_STYLES}</style>

      {/* SVG 滤镜 */}
      <svg width="0" height="0" style={{ position: 'absolute' }}>
        <defs>
          <filter id="sketchy" x="-5%" y="-5%" width="110%" height="110%">
            <feTurbulence type="fractalNoise" baseFrequency="0.055" numOctaves="2" seed="8" result="n" />
            <feDisplacementMap in="SourceGraphic" in2="n" scale="1.2" xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>
      </svg>

      {/* ── 主舞台 ── */}
      <div className="flex-1 flex items-center justify-center w-full" style={{ minHeight: 0 }}>

        {/* 定位容器：固定宽高，在小屏幕上整体缩放 */}
        <div style={{
          position: 'relative',
          width: CONTAINER_W,
          height: CONTAINER_H,
          flexShrink: 0,
          transform: `scale(${containerScale})`,
          transformOrigin: 'center center',
        }}>

          {/* 正方体：居中偏下15px */}
          <div style={{
            position: 'absolute',
            left: (CONTAINER_W - CUBE_SIZE) / 2,   // 260
            top:  (CONTAINER_H - CUBE_SIZE) / 2 + 15,  // 235
            zIndex: 10,
          }}>
            <RotatingCube onClick={handleCubeClick} size={CUBE_SIZE} />
          </div>

          {/* 9 个标签 */}
          {tagsShown && TAG_DEFS.map(({ text, rot, jitter, dur, style }, i) =>
            visibleTags.includes(i) ? (
              <TagLabel
                key={`${tagKey}-${i}`}
                text={text}
                rot={rot}
                jitter={jitter}
                dur={dur}
                style={style}
                delay={i * 0.18}
                tagKey={tagKey}
                allShown={allShown}
                onDismiss={() => handleTagDismiss(i)}
              />
            ) : null
          )}
        </div>
      </div>

      {/* ── 底部占位（保持底部导航栏间距） ── */}
      <div style={{ height: 72 }} />

      {/* ── 右下角小正方体按钮（fixed，底部导航栏上方，左移） ── */}
      <div
        style={{
          position: 'fixed',
          bottom: winW <= 640 ? 80 : 72,
          right: winW <= 640 ? 20 : 68,
          zIndex: 9999,
          cursor: 'pointer',
        }}
        title={chatOpen ? '关闭对话' : '和 Shuyu 的 AI 聊聊'}
      >
        <SmallCubeBtn onClick={handleSmallCubeClick} />
      </div>

      {/* ── Coze 浮动聊天面板（始终挂载，保留对话历史） ── */}
      <CozeChatPanel open={chatOpen} onClose={() => setChatOpen(false)} />

      {/* 角落装饰文字 */}
      <div className="absolute top-8 left-12 jitter-text pointer-events-none"
        style={{ fontFamily: "'Special Elite', monospace", fontSize: '0.6rem', color: 'rgba(255,255,255,0.1)', letterSpacing: '0.18em' }}>
        SHUYU · 2002 · TAIZHOU
      </div>
      <div className="absolute top-8 right-12 jitter-text pointer-events-none"
        style={{ fontFamily: "'Special Elite', monospace", fontSize: '0.6rem', color: 'rgba(255,255,255,0.1)', letterSpacing: '0.1em', textAlign: 'right' }}>
        CLICK CUBE TO EXPLORE
      </div>
    </div>
  );
}
