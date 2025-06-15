import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, User, Users } from 'lucide-react';

interface AudioPlayerProps {
  verseId: string;
  language: string;
  version: string;
  reference: string;
  text: string;
}

interface AudioUrls {
  male?: string;
  female?: string;
}

export function AudioPlayer({ verseId, language, version, reference, text }: AudioPlayerProps) {
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
    loadAudioUrls();
  }, [verseId, language, version]);

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
        setError('Audio not available for this verse');
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

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
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

      {/* 经文信息 */}
      <div className="mb-3">
        <div className="text-sm text-white/70 mb-1">{reference}</div>
        <div className="text-xs text-white/50 line-clamp-2">{text}</div>
      </div>

      {/* 控制按钮区域 */}
      <div className="flex items-center justify-between mb-3">
        {/* 播放控制 */}
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

          {/* 音量控制 */}
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

        {/* 男女声切换 */}
        <div className="flex items-center space-x-1">
          <button
            onClick={toggleGender}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200
                      ${currentGender === 'male' 
                        ? 'bg-blue-500/80 text-white' 
                        : 'bg-white/10 text-white/70 hover:bg-white/20'}`}
          >
            <User className="w-3 h-3 inline mr-1" />
            男声
          </button>
          <button
            onClick={toggleGender}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200
                      ${currentGender === 'female' 
                        ? 'bg-pink-500/80 text-white' 
                        : 'bg-white/10 text-white/70 hover:bg-white/20'}`}
          >
            <Users className="w-3 h-3 inline mr-1" />
            女声
          </button>
        </div>
      </div>

      {/* 进度条 */}
      <div className="space-y-2">
        <div 
          className="w-full h-2 bg-white/10 rounded-full cursor-pointer overflow-hidden"
          onClick={handleProgressClick}
        >
          <div 
            className="h-full bg-gradient-to-r from-blue-400 to-purple-400 rounded-full transition-all duration-150"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
        
        {/* 时间显示 */}
        <div className="flex justify-between text-xs text-white/50">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* 错误提示 */}
      {error && (
        <div className="mt-2 text-xs text-red-300 bg-red-500/20 rounded px-2 py-1">
          {error}
        </div>
      )}

      {/* 加载状态 */}
      {isLoading && !error && (
        <div className="mt-2 text-xs text-white/50 flex items-center">
          <div className="w-3 h-3 border border-white/30 border-t-white rounded-full animate-spin mr-2" />
          Loading audio...
        </div>
      )}
    </div>
  );
} 