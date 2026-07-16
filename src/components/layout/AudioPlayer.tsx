'use client';

import { useState, useEffect, useRef } from 'react';

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: (() => void) | undefined;
  }
}

export default function AudioPlayer() {
  const [mounted, setMounted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isReady, setIsReady] = useState(false);
  const playerRef = useRef<any>(null);
  const userInteractedRef = useRef<boolean>(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const initYTPlayer = () => {
      if (window.YT && window.YT.Player) {
        try {
          playerRef.current = new window.YT.Player('ambient-yt-player', {
            videoId: 'VQB7j7DQdVI',
            playerVars: {
              autoplay: 1,
              mute: 1,
              loop: 1,
              playlist: 'VQB7j7DQdVI',
              controls: 0,
              disablekb: 1,
              fs: 0,
              rel: 0,
              playsinline: 1,
              enablejsapi: 1,
            },
            events: {
              onReady: (event: any) => {
                setIsReady(true);
                try {
                  event.target.mute();
                  event.target.playVideo();
                } catch (e) {
                  console.error('Error auto-starting muted video:', e);
                }

                if (userInteractedRef.current) {
                  try {
                    event.target.unMute();
                    event.target.setVolume(50);
                    setIsPlaying(true);
                    setIsMuted(false);
                  } catch (e) {
                    console.error('Error unmuting after user interaction:', e);
                  }
                }
              },
              onStateChange: (event: any) => {
                if (event.data === window.YT.PlayerState.ENDED) {
                  event.target.playVideo();
                }
                if (event.data === window.YT.PlayerState.PLAYING) {
                  if (event.target.isMuted && !event.target.isMuted()) {
                    setIsPlaying(true);
                    setIsMuted(false);
                  }
                }
              },
            },
          });
        } catch (err) {
          console.error('Failed to initialize YT Player:', err);
        }
      }
    };

    if (window.YT && window.YT.Player) {
      initYTPlayer();
    } else {
      const prevCallback = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        if (prevCallback) prevCallback();
        initYTPlayer();
      };

      if (!document.getElementById('yt-iframe-api-script')) {
        const tag = document.createElement('script');
        tag.id = 'yt-iframe-api-script';
        tag.src = 'https://www.youtube.com/iframe_api';
        const firstScriptTag = document.getElementsByTagName('script')[0];
        if (firstScriptTag && firstScriptTag.parentNode) {
          firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
        } else {
          document.head.appendChild(tag);
        }
      }
    }

    return () => {
      if (playerRef.current && typeof playerRef.current.destroy === 'function') {
        try {
          playerRef.current.destroy();
        } catch (e) {
          // Ignore cleanup errors
        }
      }
    };
  }, [mounted]);

  const toggleAudio = () => {
    userInteractedRef.current = true;

    if (!playerRef.current || typeof playerRef.current.unMute !== 'function') {
      setIsPlaying((prev) => !prev);
      setIsMuted((prev) => !prev);
      return;
    }

    try {
      if (isPlaying && !isMuted) {
        playerRef.current.mute();
        setIsPlaying(false);
        setIsMuted(true);
      } else {
        playerRef.current.unMute();
        playerRef.current.setVolume(50);
        playerRef.current.playVideo();
        setIsPlaying(true);
        setIsMuted(false);
      }
    } catch (e) {
      console.error('Error toggling audio player:', e);
      setIsPlaying((prev) => !prev);
      setIsMuted((prev) => !prev);
    }
  };

  if (!mounted) return null;

  return (
    <>
      {/* Hidden YouTube iframe container */}
      <div className="aria-hidden hidden pointer-events-none w-0 h-0 overflow-hidden opacity-0" aria-hidden="true">
        <div id="ambient-yt-player" />
      </div>

      {/* Floating Audio Control Widget */}
      <div className="fixed bottom-5 left-5 z-50 flex items-center group">
        <button
          type="button"
          onClick={toggleAudio}
          className={`relative flex items-center justify-center w-12 h-12 rounded-full text-white bg-white/10 backdrop-blur-md border border-white/20 shadow-lg shadow-black/40 hover:scale-105 hover:bg-white/20 active:scale-95 transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-spotlight)] ${
            !isPlaying
              ? 'ring-2 ring-[var(--color-spotlight)]/50 animate-pulse'
              : 'border-[var(--color-spotlight)]/60'
          }`}
          aria-label="Háttérzene lejátszása és némítása"
        >
          {isPlaying && !isMuted ? (
            /* Playing Equalizer Animation */
            <span className="flex items-end justify-center gap-0.5 h-5 w-5" aria-hidden="true">
              <span className="w-1 bg-[var(--color-spotlight)] rounded-full animate-eq-bar-1 h-full" />
              <span className="w-1 bg-white rounded-full animate-eq-bar-2 h-3/4" />
              <span className="w-1 bg-[var(--color-spotlight)] rounded-full animate-eq-bar-3 h-4/5" />
            </span>
          ) : (
            /* Muted / Paused Music Note Icon */
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.75}
              stroke="currentColor"
              className="w-5 h-5 text-[var(--color-spotlight)] group-hover:scale-110 transition-transform duration-200"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 9l10.5-3m0 0v12m0-12L9 9.75M9 9v12m0-12l10.5-3M9 21a3 3 0 100-6 3 3 0 000 6zm10.5 0a3 3 0 100-6 3 3 0 000 6z"
              />
            </svg>
          )}

          {/* Pulse Glow when muted */}
          {!isPlaying && (
            <span className="absolute -inset-1 rounded-full bg-[var(--color-spotlight)]/20 animate-ping pointer-events-none -z-10" />
          )}
        </button>

        {/* Tooltip */}
        <span className="absolute left-full ml-3 top-1/2 -translate-y-1/2 whitespace-nowrap bg-[var(--color-smoke)]/90 backdrop-blur-md text-white text-xs font-medium py-1.5 px-3 rounded-lg border border-white/15 shadow-xl pointer-events-none opacity-0 group-hover:opacity-100 group-hover:translate-x-0 -translate-x-1 transition-all duration-200">
          {!isPlaying ? 'Zene bekapcsolása 🎵' : 'Zene kikapcsolása 🔇'}
        </span>
      </div>
    </>
  );
}
