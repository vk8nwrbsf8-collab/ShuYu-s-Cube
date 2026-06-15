/**
 * BottomNav - 全局底部导航栏
 * 四个文本按钮：I / Navigate / Foggy / Journey
 * 当前页面高亮（加粗+放大），页面切换淡入淡出
 */
export default function BottomNav({ current, onChange }) {
  const navItems = [
    { id: 'I',        label: 'I' },
    { id: 'Navigate', label: 'Navigate' },
    { id: 'Foggy',    label: 'Foggy' },
    { id: 'Journey',  label: 'Journey' },
  ];

  const isMobile = typeof window !== 'undefined' && window.innerWidth <= 640;

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 flex items-center justify-center pb-5 pt-3"
      style={{
        background: 'rgb(0,0,0)',
        gap: isMobile ? '1.6rem' : '2.5rem',
      }}
    >
      {/* 装饰横线 */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 opacity-20"
        style={{ width: isMobile ? '200px' : '260px', height: '1px', background: '#FFF' }}
      />

      {navItems.map((item) => {
        const isActive = current === item.id;
        return (
          <button
            key={item.id}
            onClick={() => onChange(item.id)}
            className={`nav-item relative text-white transition-all duration-300 bg-transparent border-none outline-none
              ${isActive ? 'active jitter-text' : 'opacity-55 hover:opacity-90'}`}
            style={{
              fontFamily: "'Caveat', cursive",
              fontSize: isMobile
                ? (isActive ? '1.15rem' : '0.92rem')
                : (isActive ? '1.4rem' : '1.1rem'),
              fontWeight: isActive ? 700 : 400,
              letterSpacing: '0.06em',
            }}
            aria-current={isActive ? 'page' : undefined}
          >
            {item.label}

            {/* 手绘下划线 - 仅激活时显示 */}
            {isActive && (
              <svg
                className="absolute -bottom-2 left-0 w-full"
                height="6"
                viewBox="0 0 60 6"
                preserveAspectRatio="none"
                fill="none"
              >
                <path
                  d="M1,3 Q10,1 20,3.5 Q35,5 50,2.5 Q58,1 60,3"
                  stroke="white"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  fill="none"
                />
              </svg>
            )}
          </button>
        );
      })}
    </nav>
  );
}
