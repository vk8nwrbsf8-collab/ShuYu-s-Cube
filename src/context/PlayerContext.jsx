/**
 * PlayerContext - 全局播放器状态
 * 提供播放状态、控制方法，audioRef 挂在此处，页面切换不中断播放
 */
import { createContext, useContext, useRef, useState, useCallback, useEffect } from 'react';
import { albums } from '../data/hobbies';

const PlayerContext = createContext(null);

// 线上使用支持 CORS 的公共 API，本地开发使用代理
const NETEASE_API = import.meta.env.DEV
  ? '/netease-api'
  : 'https://music-api.gdstudio.xyz/api.php?types=url&source=netease&id=';

export function fmtTime(sec) {
  if (!sec || isNaN(sec)) return '0:00';
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${String(s).padStart(2, '0')}`;
}

export function PlayerProvider({ children }) {
  const [playingTrack, setPlayingTrack] = useState(null); // { id, name, albumTitle, cover, albumIdx, trackIdx }
  const [isPlaying, setIsPlaying]       = useState(false);
  const [audioUrl, setAudioUrl]         = useState(null);
  const [progress, setProgress]         = useState(0);   // 0-1
  const [duration, setDuration]         = useState(0);
  const [currentTime, setCurrentTime]   = useState(0);
  const [loading, setLoading]           = useState(false);
  const [errMsg, setErrMsg]             = useState('');
  // 记录 Foggy 页当前子页：null | 'film' | 'music' | 'bass'
  const [foggySubPage, setFoggySubPage] = useState(null);

  const audioRef = useRef(null);

  // 播放指定曲目
  const playSong = useCallback(async (track, albumRef, albumTrackIdx) => {
    setLoading(true);
    setErrMsg('');
    setPlayingTrack({
      ...track,
      albumTitle: albumRef.albumTitle,
      cover: albumRef.cover,
      albumIdx: albums.indexOf(albumRef),
      trackIdx: albumTrackIdx,
    });
    try {
      let url;
      if (import.meta.env.DEV) {
        // 本地开发：走代理访问本地 NeteaseCloudMusicApi
        const res  = await fetch(`${NETEASE_API}/song/url?id=${track.id}`);
        const data = await res.json();
        url = data?.data?.[0]?.url;
      } else {
        // 线上：使用支持 CORS 的公共 API
        const res  = await fetch(`${NETEASE_API}${track.id}`);
        const data = await res.json();
        url = data?.url;
      }
      if (!url) throw new Error('无版权或需登录');
      setAudioUrl(url);
      setIsPlaying(true);
    } catch (e) {
      setErrMsg(e.message || '播放失败');
      setIsPlaying(false);
    } finally {
      setLoading(false);
    }
  }, []);

  // URL 就绪后加载并播放
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !audioUrl) return;
    audio.src = audioUrl;
    audio.load();
    if (isPlaying) audio.play().catch(() => setIsPlaying(false));
  }, [audioUrl]); // eslint-disable-line react-hooks/exhaustive-deps

  // 同步播放/暂停
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) audio.play().catch(() => setIsPlaying(false));
    else audio.pause();
  }, [isPlaying]);

  // 播放下一首
  const playNext = useCallback(() => {
    if (!playingTrack) return;
    const currentAlbum = albums[playingTrack.albumIdx];
    const nextTIdx = playingTrack.trackIdx + 1;
    if (nextTIdx < currentAlbum.tracks.length) {
      playSong(currentAlbum.tracks[nextTIdx], currentAlbum, nextTIdx);
    } else {
      setIsPlaying(false);
    }
  }, [playingTrack, playSong]);

  // 播放上一首
  const playPrev = useCallback(() => {
    if (!playingTrack) return;
    const currentAlbum = albums[playingTrack.albumIdx];
    if (playingTrack.trackIdx > 0) {
      playSong(currentAlbum.tracks[playingTrack.trackIdx - 1], currentAlbum, playingTrack.trackIdx - 1);
    }
  }, [playingTrack, playSong]);

  // 跳转进度
  const seekTo = useCallback((ratio) => {
    const audio = audioRef.current;
    if (audio && audio.duration) {
      audio.currentTime = ratio * audio.duration;
    }
  }, []);

  return (
    <PlayerContext.Provider value={{
      playingTrack, isPlaying, setIsPlaying,
      progress, duration, currentTime,
      loading, errMsg,
      playSong, playNext, playPrev, seekTo,
      audioRef,
      foggySubPage, setFoggySubPage,
    }}>
      {/* 全局唯一 audio 元素，挂在最顶层，页面切换不销毁 */}
      <audio
        ref={audioRef}
        onTimeUpdate={() => {
          const a = audioRef.current;
          if (!a) return;
          setCurrentTime(a.currentTime);
          setProgress(a.duration ? a.currentTime / a.duration : 0);
        }}
        onLoadedMetadata={() => setDuration(audioRef.current?.duration || 0)}
        onEnded={playNext}
        onError={() => { setErrMsg('播放出错'); setIsPlaying(false); }}
      />
      {children}
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  return useContext(PlayerContext);
}
