import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, UserRound, Users } from 'lucide-react';

interface FloatingAudioPlayerProps {
  verseId: string;
  language: string;
  version: string;
  isVisible: boolean;
}

interface AudioUrls {
  male?: string;
  female?: string;
}

export function FloatingAudioPlayer({ verseId, language, version, isVisible }: FloatingAudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentGender, setCurrentGender] = useState<'male' | 'female'>('male');
  const [isLoading, setIsLoading] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [audioUrls, setAudioUrls] = useState<AudioUrls>({});
  const [error, setError] = useState<string | null>(null);
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // 加载音频URL
  useEffect(() => {
    if (verseId && language && version) {
      loadAudioUrls();
    }
  }, [verseId, language, version]);

  // 当经文改变时重置播放状态
  useEffect(() => {
    setIsPlaying(false);
    setCurrentTime(0);
    setError(null);
  }, [verseId]);

  const loadAudioUrls = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // 从TTS清单中获取音频URL
      const response = await fetch('/tts-manifest.json');
      const manifest = await response.json();
      
      const verseAudio = manifest[language]?.[version]?.[verseId];
      if (verseAudio) {
        setAudioUrls({
          male: verseAudio.male?.url,
          female: verseAudio.female?.url
        });
      } else {
        setError('Audio not available');
      }
    } catch (err) {
      console.error('Failed to load audio URLs:', err);
      setError('Failed to load audio');
    } finally {
      setIsLoading(false);
    }
  };

  // 切换播放/暂停
  const togglePlayPause = async () => {
    if (!audioRef.current || !audioUrls[currentGender]) return;

    try {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        setIsLoading(true);
        await audioRef.current.play();
        setIsPlaying(true);
      }
    } catch (err) {
      console.error('Playback error:', err);
      setError('Playback failed');
    } finally {
      setIsLoading(false);
    }
  };

  // 切换男女声
  const toggleGender = () => {
    const newGender = currentGender === 'male' ? 'female' : 'male';
    setCurrentGender(newGender);
    
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
      setCurrentTime(0);
    }
  };

  // 切换静音
  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  // 音频事件处理
  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const handleError = () => {
    setError('Audio playback error');
    setIsPlaying(false);
    setIsLoading(false);
  };

  // 进度条点击
  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current || !duration) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const newTime = (clickX / rect.width) * duration;
    
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  // 格式化时间
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

  if (!isVisible) return null;

  return (
    <div className={`fixed bottom-0 left-0 right-0 z-50 transform transition-transform duration-300 ${
      isVisible ? 'translate-y-0' : 'translate-y-full'
    }`}>
      {/* 音频元素 */}
      <audio
        ref={audioRef}
        src={audioUrls[currentGender]}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
        onError={handleError}
        preload="metadata"
      />

      {/* 播放器容器 */}
      <div className="bg-black/80 backdrop-blur-lg border-t border-white/10">
        {/* 进度条 */}
        <div 
          className="w-full h-1 bg-white/10 cursor-pointer"
          onClick={handleProgressClick}
        >
          <div 
            className="h-full bg-gradient-to-r from-blue-400 to-purple-400 transition-all duration-150"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>

        {/* 控制区域 */}
        <div className="px-4 py-3">
          <div className="flex items-center justify-between max-w-md mx-auto">
            {/* 左侧：播放控制 */}
            <div className="flex items-center space-x-3">
              <button
                onClick={togglePlayPause}
                disabled={isLoading || !audioUrls[currentGender]}
                className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 
                         disabled:opacity-50 disabled:cursor-not-allowed
                         flex items-center justify-center transition-all duration-200
                         hover:scale-105 active:scale-95"
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : isPlaying ? (
                  <Pause className="w-5 h-5 text-white" />
                ) : (
                  <Play className="w-5 h-5 text-white ml-0.5" />
                )}
              </button>

              {/* 时间显示 */}
              <div className="text-xs text-white/70 min-w-[80px]">
                {formatTime(currentTime)} / {formatTime(duration)}
              </div>
            </div>

            {/* 中间：男女声切换 */}
            <div className="flex items-center space-x-1">
              <button
                onClick={() => setCurrentGender('male')}
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200
                          ${currentGender === 'male' 
                            ? 'bg-blue-500/80 text-white' 
                            : 'bg-white/10 text-white/50 hover:bg-white/20 hover:text-white/70'}`}
                title="男声"
              >
                <UserRound className="w-4 h-4" />
              </button>
              <button
                onClick={() => setCurrentGender('female')}
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200
                          ${currentGender === 'female' 
                            ? 'bg-pink-500/80 text-white' 
                            : 'bg-white/10 text-white/50 hover:bg-white/20 hover:text-white/70'}`}
                title="女声"
              >
                <Users className="w-4 h-4" />
              </button>
            </div>

            {/* 右侧：音量控制 */}
            <div className="flex items-center space-x-2">
              <button
                onClick={toggleMute}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 
                         flex items-center justify-center transition-all duration-200"
              >
                {isMuted ? (
                  <VolumeX className="w-4 h-4 text-white/70" />
                ) : (
                  <Volume2 className="w-4 h-4 text-white/70" />
                )}
              </button>
            </div>
          </div>

          {/* 错误提示 */}
          {error && (
            <div className="mt-2 text-xs text-red-300 text-center">
              {error}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 