/**
 * NavigatePage - 【Navigate】个人经历
 *
 * 布局：左侧纵向时间轴 + 右侧大面积文字详情
 * 支持"教育经历"与"实习经历"两大板块切换
 * 点击节点，右侧淡入切换内容
 */
import { useState } from 'react';
import { education, internship } from '../data/experience';

// ── 时间轴节点 ─────────────────────────────────────────────
function TimelineNode({ item, isActive, onClick }) {
  return (
    <div
      className="flex items-start gap-4 cursor-pointer group"
      onClick={() => onClick(item.id)}
    >
      {/* 节点圆点 */}
      <div className="flex flex-col items-center mt-1" style={{ minWidth: 20 }}>
        <div
          className={`timeline-dot transition-all duration-300 ${isActive ? 'active scale-125' : 'group-hover:scale-110'}`}
        />
      </div>

      {/* 内容 */}
      <div className={`pb-10 transition-opacity duration-300 ${isActive ? 'opacity-100' : 'opacity-50 group-hover:opacity-75'}`}>
        <p
          className="jitter-text"
          style={{ fontFamily: "'Special Elite', monospace", fontSize: '0.72rem', letterSpacing: '0.12em', opacity: 0.6 }}
        >
          {item.year}
        </p>
        <p
          className="mt-0.5"
          style={{
            fontFamily: "'Caveat', cursive",
            fontSize: '1.1rem',
            fontWeight: isActive ? 700 : 400,
          }}
        >
          {item.school || item.company}
        </p>
        <p
          style={{ fontFamily: "'Caveat', cursive", fontSize: '0.9rem', opacity: 0.6 }}
        >
          {item.degree || item.role}
        </p>
      </div>
    </div>
  );
}

// ── 详情面板 ──────────────────────────────────────────────
function DetailPanel({ item, visible }) {
  if (!item) return null;

  return (
    <div
      className={`h-full flex flex-col transition-all duration-500 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
      key={item.id}
    >
      {/* 年份 */}
      <p
        className="jitter-text mb-1"
        style={{ fontFamily: "'Special Elite', monospace", fontSize: '0.75rem', letterSpacing: '0.18em', opacity: 0.45 }}
      >
        {item.year}
      </p>

      {/* 机构 */}
      <h2
        className="jitter-text mb-1"
        style={{ fontFamily: "'Caveat', cursive", fontSize: '2rem', fontWeight: 700, lineHeight: 1.2 }}
      >
        {item.school || item.company}
      </h2>

      {/* 角色 */}
      <p
        className="mb-1"
        style={{ fontFamily: "'Caveat', cursive", fontSize: '1.15rem', opacity: 0.65 }}
      >
        {item.degree || item.role}
        <span className="ml-4 opacity-50" style={{ fontSize: '0.88rem', letterSpacing: '0.05em' }}>
          / {item.location}
        </span>
      </p>

      {/* 分隔线 */}
      <svg width="100%" height="12" className="my-4 opacity-30" viewBox="0 0 300 12" preserveAspectRatio="none">
        <path d="M0,6 Q30,3 60,7 Q90,10 120,5 Q150,2 180,7 Q210,10 240,5 Q270,2 300,6"
          stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      </svg>

      {/* 描述文本 */}
      <p
        className="leading-relaxed flex-1"
        style={{ fontFamily: "'Caveat', cursive", fontSize: '1.05rem', whiteSpace: 'pre-wrap', opacity: 0.85 }}
      >
        {item.description}
      </p>

      {/* 标签 */}
      <div className="flex flex-wrap gap-2 mt-6">
        {item.tags.map((tag) => (
          <span
            key={tag}
            className="sketch-border jitter-text px-3 py-1"
            style={{ fontFamily: "'Caveat', cursive", fontSize: '0.85rem', opacity: 0.75 }}
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}

// ── 主组件 ────────────────────────────────────────────────
export default function NavigatePage() {
  const [tab, setTab]         = useState('edu');     // 'edu' | 'int'
  const [activeId, setActiveId] = useState(education[0].id);
  const [visible, setVisible] = useState(true);

  const list = tab === 'edu' ? education : internship;
  const activeItem = list.find(i => i.id === activeId) || list[0];

  const handleTabChange = (newTab) => {
    if (newTab === tab) return;
    setVisible(false);
    setTimeout(() => {
      setTab(newTab);
      const newList = newTab === 'edu' ? education : internship;
      setActiveId(newList[0].id);
      setVisible(true);
    }, 300);
  };

  const handleNodeClick = (id) => {
    if (id === activeId) return;
    setVisible(false);
    setTimeout(() => {
      setActiveId(id);
      setVisible(true);
    }, 250);
  };

  return (
    <div className="w-full h-full flex flex-col" style={{ padding: '48px 64px 80px' }}>

      {/* ── 顶部 Tab 切换 ── */}
      <div className="flex items-center gap-8 mb-12">
        {[
          { id: 'edu', label: '教育经历' },
          { id: 'int', label: '工作经历' },
        ].map(({ id, label }) => (
          <button
            key={id}
            onClick={() => handleTabChange(id)}
            className={`relative bg-transparent border-none cursor-pointer transition-all duration-300
              ${tab === id ? 'jitter-text' : 'opacity-40 hover:opacity-70'}`}
            style={{
              fontFamily: "'Caveat', cursive",
              fontSize: tab === id ? '1.6rem' : '1.3rem',
              fontWeight: tab === id ? 700 : 400,
              color: '#FFF',
              letterSpacing: '0.03em',
              paddingBottom: 6,
            }}
          >
            {label}
            {tab === id && (
              <svg className="absolute -bottom-1 left-0 w-full" height="6" viewBox="0 0 80 6" preserveAspectRatio="none" fill="none">
                <path d="M0,4 Q20,1 40,4 Q60,6 80,3" stroke="white" strokeWidth="2" strokeLinecap="round" />
              </svg>
            )}
          </button>
        ))}
      </div>

      {/* ── 主体：时间轴 + 详情 ── */}
      <div className="flex flex-1 gap-16 overflow-hidden">

        {/* 左：时间轴 */}
        <div className="relative scroll-container" style={{ width: 220, flexShrink: 0 }}>
          {/* 竖线 */}
          <div
            className="absolute left-[9px] top-2 bottom-8 opacity-20"
            style={{ width: 1, background: 'linear-gradient(to bottom, white 0%, transparent 100%)' }}
          />

          <div className="space-y-0">
            {list.map((item) => (
              <TimelineNode
                key={item.id}
                item={item}
                isActive={item.id === activeId}
                onClick={handleNodeClick}
              />
            ))}
          </div>
        </div>

        {/* 右：详情面板 */}
        <div className="flex-1 scroll-container pr-4">
          <DetailPanel item={activeItem} visible={visible} />
        </div>
      </div>
    </div>
  );
}
