/**
 * LandingPage - 预加载入场屏
 * 纯黑全屏，中心为手绘风格播放按钮 SVG
 * 点击后触发淡出动画，进入主站
 */
import { useState } from 'react';

export default function LandingPage({ onEnter }) {
  const [exiting, setExiting] = useState(false);

  const handleClick = () => {
    if (exiting) return;
    setExiting(true);
    setTimeout(() => {
      onEnter();
    }, 700);
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-black cursor-pointer select-none
        ${exiting ? 'animate-[fadeOut_0.7s_ease_forwards]' : 'animate-[fadeIn_0.8s_ease_forwards]'}`}
      style={{ animationFillMode: 'both' }}
      onClick={handleClick}
    >
      {/* SVG 全局手绘滤镜定义 */}
      <svg width="0" height="0" className="absolute">
        <defs>
          <filter id="sketchy" x="-10%" y="-10%" width="120%" height="120%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.04 0.04"
              numOctaves="3"
              seed="2"
              result="noise"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale="2"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>
      </svg>

      {/* 手绘播放按钮 SVG */}
      <div className="relative flex items-center justify-center">
        {/* 外圆 */}
        <svg
          width="160"
          height="160"
          viewBox="0 0 160 160"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="jitter-svg"
          style={{ filter: 'url(#sketchy)' }}
        >
          {/* 外圆圈（多笔迹模拟手绘） */}
          <circle
            cx="80" cy="80" r="68"
            stroke="white"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
            strokeDasharray="1 0"
            style={{ opacity: 0.9 }}
          />
          {/* 略偏移的副圆，增加手绘多笔效果 */}
          <circle
            cx="80.5" cy="79.5" r="68.5"
            stroke="white"
            strokeWidth="1"
            strokeLinecap="round"
            fill="none"
            strokeDasharray="420 5"
            style={{ opacity: 0.35 }}
          />
          <circle
            cx="79.5" cy="80.5" r="67.5"
            stroke="white"
            strokeWidth="0.8"
            strokeLinecap="round"
            fill="none"
            strokeDasharray="10 2 430 3"
            style={{ opacity: 0.2 }}
          />

          {/* 播放三角形（手绘风格，略不规则） */}
          {/* 主三角 */}
          <polygon
            points="66,52 66,108 114,80"
            stroke="white"
            strokeWidth="2.5"
            strokeLinejoin="round"
            strokeLinecap="round"
            fill="none"
          />
          {/* 副笔迹 */}
          <polygon
            points="65.5,52.5 65.5,108.5 113.5,80.5"
            stroke="white"
            strokeWidth="0.8"
            strokeLinejoin="round"
            strokeLinecap="round"
            fill="none"
            style={{ opacity: 0.3 }}
          />
          {/* 内部随机草稿线，增加手绘质感 */}
          <line x1="67" y1="63" x2="67" y2="97" stroke="white" strokeWidth="0.5" style={{ opacity: 0.12 }} />
          <line x1="74" y1="59" x2="74" y2="101" stroke="white" strokeWidth="0.5" style={{ opacity: 0.1 }} />
        </svg>
      </div>

      {/* 下方提示文字 */}
      <p
        className="jitter-text mt-10 text-white/50"
        style={{ fontFamily: "'Caveat', cursive", fontSize: '1.1rem', letterSpacing: '0.12em' }}
      >
        点击进入
      </p>

      {/* 角落装饰线 */}
      <svg
        className="absolute top-8 left-8 opacity-20"
        width="60" height="60" viewBox="0 0 60 60" fill="none"
      >
        <line x1="0" y1="60" x2="0" y2="0" stroke="white" strokeWidth="1.5" />
        <line x1="0" y1="0" x2="60" y2="0" stroke="white" strokeWidth="1.5" />
      </svg>
      <svg
        className="absolute top-8 right-8 opacity-20"
        width="60" height="60" viewBox="0 0 60 60" fill="none"
      >
        <line x1="60" y1="60" x2="60" y2="0" stroke="white" strokeWidth="1.5" />
        <line x1="60" y1="0" x2="0" y2="0" stroke="white" strokeWidth="1.5" />
      </svg>
      <svg
        className="absolute bottom-8 left-8 opacity-20"
        width="60" height="60" viewBox="0 0 60 60" fill="none"
      >
        <line x1="0" y1="0" x2="0" y2="60" stroke="white" strokeWidth="1.5" />
        <line x1="0" y1="60" x2="60" y2="60" stroke="white" strokeWidth="1.5" />
      </svg>
      <svg
        className="absolute bottom-8 right-8 opacity-20"
        width="60" height="60" viewBox="0 0 60 60" fill="none"
      >
        <line x1="60" y1="0" x2="60" y2="60" stroke="white" strokeWidth="1.5" />
        <line x1="60" y1="60" x2="0" y2="60" stroke="white" strokeWidth="1.5" />
      </svg>
    </div>
  );
}
