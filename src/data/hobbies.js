/**
 * 爱好数据：影视、音乐、贝斯
 * 根据简历标签 & 个人 Tags 填充真实偏好
 */

// ── 影视收藏 ───────────────────────────────────────────────
export const films = [
  {
    id: 'f1',
    title: '花束般的恋爱',
    year: 2021,
    director: '土井裕泰',
    cast: '菅田将晖 / 有村架纯',
    genre: '爱情 / 文艺',
    note: '把精神世界高度重合的两人写成了一段必然消亡的故事，美得令人窒息。',
    poster: null,
    color: '#1e1e1e',
  },
  {
    id: 'f2',
    title: '请回答 1988',
    year: 2015,
    director: '申元浩',
    cast: '李惠利 / 柳俊烈 / 朴宝剑',
    genre: '剧集 / 年代 / 治愈',
    note: '胡同里的青春，是永远无法复刻的温暖。反复看了三遍，每次都哭。',
    poster: null,
    color: '#1a1a1a',
  },
  {
    id: 'f3',
    title: '哈尔的移动城堡',
    year: 2004,
    director: '宫崎骏',
    cast: '倍赏千惠子 / 木村拓哉',
    genre: '动画 / 魔幻',
    note: '你活着，就是最好的。每次重看都会在不同的年纪读出不同的东西。',
    poster: null,
    color: '#252525',
  },
  {
    id: 'f4',
    title: '伦敦生活',
    year: 2016,
    director: '哈利·布拉多耶拉克',
    cast: '菲比·沃勒-布里奇',
    genre: '剧集 / 独白喜剧',
    note: '第四堵墙被打穿的一刻，感觉整个叙事体系都在向我倾诉。',
    poster: null,
    color: '#1c1c1c',
  },
  {
    id: 'f5',
    title: '步履不停',
    year: 2008,
    director: '是枝裕和',
    cast: '阿部寛 / 夏川结衣',
    genre: '家庭 / 文艺',
    note: '人生总比想象的慢一步。这部电影是一个温柔的提醒。',
    poster: null,
    color: '#232323',
  },
  {
    id: 'f6',
    title: '无耻之徒（美版）',
    year: 2011,
    director: '约翰·威尔斯',
    cast: '威廉·H·梅西 / 杰里米·艾伦·怀特',
    genre: '剧集 / 家庭 / 现实',
    note: '混乱是常态，爱是例外，但他们仍然在混乱中选择彼此。',
    poster: null,
    color: '#202020',
  },
];

// ── 音乐收藏 ───────────────────────────────────────────────
// 简历标签：网易云黑胶五级VIP
export const albums = [
  {
    id: 'm1',
    albumTitle: 'Norman Fucking Rockwell!',
    artist: 'Lana Del Rey',
    year: 2019,
    cover: null,
    favSongs: ['Venice Bitch', 'Mariners Apartment Complex', 'The Greatest', 'Hope Is a Dangerous Thing'],
    livePhotos: [],
    note: '开车的时候听这张，感觉整条路都是诗。',
  },
  {
    id: 'm2',
    albumTitle: 'Melodrama',
    artist: 'Lorde',
    year: 2017,
    cover: null,
    favSongs: ['Green Light', 'Liability', 'Sober', 'Perfect Places', 'Ribs'],
    livePhotos: [],
    note: '把 21 岁所有的混乱和狂欢写成了一张完整的概念专辑，怎么可能不爱。',
  },
  {
    id: 'm3',
    albumTitle: '彩虹',
    artist: '周杰伦',
    year: 2006,
    cover: null,
    favSongs: ['退后', '彩虹', '白色风车', '枫', '迷迭香'],
    livePhotos: [],
    note: '十几岁时反复听到几乎刻进 DNA 的专辑，现在听还是会掉眼泪。',
  },
  {
    id: 'm4',
    albumTitle: 'Short n\' Sweet',
    artist: 'Sabrina Carpenter',
    year: 2024,
    cover: null,
    favSongs: ['Please Please Please', 'Espresso', 'Taste', 'Dumb & Poetic'],
    livePhotos: [],
    note: '2024 年最上头的专辑，每首都想弹 Bass Cover。',
  },
];

// ── 贝斯 Cover 曲目 ────────────────────────────────────────
// 结合 Tags "网易云黑胶五级VIP" + 音乐偏好
export const bassCovers = [
  {
    id: 'b1',
    title: 'Please Please Please',
    artist: 'Sabrina Carpenter',
    videoUrl: '',
    duration: '3:05',
    note: '练了很久终于弹顺了，低频部分超级带劲。',
  },
  {
    id: 'b2',
    title: 'Espresso',
    artist: 'Sabrina Carpenter',
    videoUrl: '',
    duration: '2:55',
    note: 'bass line 极简但非常 groove，很好玩。',
  },
  {
    id: 'b3',
    title: 'Liability',
    artist: 'Lorde',
    videoUrl: '',
    duration: '3:44',
    note: '只有钢琴和人声的歌用贝斯弹出来意外地有质感。',
  },
  {
    id: 'b4',
    title: 'Venice Bitch',
    artist: 'Lana Del Rey',
    videoUrl: '',
    duration: '9:37',
    note: '将近 10 分钟的迷幻之旅，沉下去弹完整首就赢了。',
  },
  {
    id: 'b5',
    title: '给我一个理由忘记',
    artist: '五月天',
    videoUrl: '',
    duration: '4:28',
    note: '第一首完整弹下来的中文歌，有纪念意义。',
  },
  {
    id: 'b6',
    title: 'Ribs',
    artist: 'Lorde',
    videoUrl: '',
    duration: '4:10',
    note: '情绪最丰沛的一首，弹到高潮段会起鸡皮疙瘩。',
  },
];
