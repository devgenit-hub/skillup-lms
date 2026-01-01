import { useEffect, useState, useRef, useMemo, useCallback } from 'react';
import { FaForward, FaBackward, FaPlayCircle, FaPauseCircle } from 'react-icons/fa';
import './style.css';

// YouTube Player API types
interface YTPlayer {
  playVideo: () => void;
  pauseVideo: () => void;
  seekTo: (seconds: number, allowSeekAhead: boolean) => void;
  getCurrentTime: () => number;
  getDuration: () => number;
  setPlaybackRate: (suggestedRate: number, allowSeekAhead: boolean) => void;
  setPlaybackQuality: (suggestedQuality: string) => void;
  addEventListener: (event: string, listener: (e: Event) => void) => void;
  removeEventListener: (event: string, listener: (e: Event) => void) => void;
  destroy: () => void;
}

interface YTPlayerEvent {
  target: {
    videoTitle: string;
    getDuration: () => number;
  };
}

interface YTPlayerStateChangeEvent {
  data: number;
  target: YTPlayer;
}

declare global {
  interface Window {
    YT: {
      Player: new (elementId: HTMLElement | null, config: YTPlayerConfig) => YTPlayer;
    };
    onYouTubeIframeAPIReady?: () => void;
  }
}

interface YTPlayerConfig {
  videoId: string | undefined;
  playerVars: {
    fs: number;
    controls: number;
    rel: number;
    modestbranding: number;
    iv_load_policy: number;
    showinfo?: number;
    disablekb?: number;
    cc_load_policy?: number;
  };
  events: {
    onReady: (event: YTPlayerEvent) => void;
    onStateChange: (event: YTPlayerStateChangeEvent) => void;
    onpause?: () => void;
    onplay?: () => void;
  };
}

interface PPButtonProps {
  isPlaying: boolean;
  Click: () => void;
  playVideo: () => void;
  pauseVideo: () => void;
}

interface ProgressBarProps {
  currentTime: number;
  duration: number;
  handleSeekChange: (time: number) => void;
  lockedStartTime: number;
  lockProgressBar: boolean;
}

interface PPIconProps {
  isPlaying: boolean;
  playVideo: () => void;
  pauseVideo: () => void;
  Click: () => void;
}

interface TimeObject {
  m: string | number;
  s: string | number;
}
const YTPlayer = ({ videoId }: { videoId: string | undefined }) => {
  const playerRef = useRef<YTPlayer | null>(null);
  const playerDivRef = useRef<HTMLDivElement | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [sspeed, setsspeed] = useState<boolean>(false);
  const [squality, setsquality] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [title, setTitle] = useState<string>('');
  const [speed, setSpeed] = useState<number>(1);
  const [lastSavedDuration] = useState<number>(10);
  const [lockedTimeDuration] = useState<number>(-1);
  const currentTimeRef = useRef<number>(currentTime);
  const [lockProgressBar] = useState<boolean>(true);

  const [showControl, setShowControl] = useState<boolean>(true);

  const togglePlay = () => {
    setIsPlaying((prev) => !prev);
  };
  const toggleControl = () => {
    setShowControl((prev) => !prev);
  };

  // useEffect(() => {
  //   if (localStorage.getItem("cp")) {
  //     const vobj = JSON.parse(localStorage.getItem("cp"));

  //     if (vobj.lockState === true || vobj.lockState === false)
  //       setLockProgressBar(vobj.lockState);
  //   }
  // }, []);

  // useEffect(() => {
  //   if (playerRef.current) {
  //     axios
  //       .post(
  //         reqs.GET_CLASS_TIME,
  //         { courseId: courseId, classId: classId },
  //         { withCredentials: true }
  //       )
  //       .then((res) => {
  //         if (res.data.succeed) {
  //           const currTime = res.data.currentTime;
  //           currentTimeRef.current = currTime;
  //           prevSavedTimeRef.current = currTime;
  //           setLastSavedDuration(currTime);
  //           setLockedTimeDuration(currTime + 20);
  //           if (currTime > 10) {
  //             setCurrentTime(currTime);
  //             playerRef.current.seekTo(currTime, true);
  //           }
  //         }
  //       })
  //       .catch((err) => {
  //         console.error(err);
  //       });
  //   }
  //   //get the current last played duration from server
  // }, [courseId, classId, videoId, playerRef.current]);

  // update current played time to server every 10 seconds
  // useEffect(() => {
  //   const intervalId = setInterval(() => {
  //     // console.log(currentTimeRef.current, prevSavedTimeRef.current);
  //     if (currentTimeRef.current > prevSavedTimeRef.current) {
  //       const dataToSend = {
  //         lockedStartTime: lastSavedDuration,
  //         currentTime: currentTimeRef.current,
  //         classId: classId,
  //         courseId: courseId,
  //       };
  //       // console.log('running');

  //       // prevSavedTimeRef.current = currentTimeRef.current;
  //       // setLastSavedDuration(currentTimeRef.current);

  //       axios
  //         .put(reqs.UPDATE_CLASS_TIME, dataToSend, { withCredentials: true })
  //         .then((res) => {
  //           if (res.data.succeed) {
  //             setLastSavedDuration(res.data.currentTime);
  //             prevSavedTimeRef.current = res.data.currentTime;
  //           }
  //         })
  //         .catch((error) => {
  //           console.error('Error saving data:', error);
  //         });
  //     }
  //   }, 10000);

  //   return () => clearInterval(intervalId);
  // }, []);

  useEffect(() => {
    currentTimeRef.current = currentTime;
    // if (currentTime > prevSavedTimeRef.current) {
    //   let extraTime = 20;
    //   if (duration - currentTime < 20) {
    //     extraTime = duration - currentTime;
    //   }
    //   setLockedTimeDuration(currentTime + extraTime);
    // }

    // if (lockedTimeDuration > -1 && duration) {
    //   // console.log(((duration - lastSavedDuration) / duration) * 100);

    //   if (((duration - lastSavedDuration) / duration) * 100 < 4) {
    //     if (doneReqCount < 1) {
    //       // console.log(classId, courseId);
    //       setIsDoneReqCount((doneReqCount) => doneReqCount + 1);
    //       const vidIdObj = localStorage.getItem("cp")
    //         ? JSON.parse(localStorage.getItem("cp"))
    //         : "";
    //       // console.log(currentplVid, classId);
    //       if (vidIdObj && vidIdObj.currentPlVidId) {
    //         const currentplVid = vidIdObj.currentPlVidId - 300;
    //         const nextClassId = vidIdObj.nextClassId
    //           ? vidIdObj.nextClassId - 450
    //           : null;
    //         // console.log(currentplVid, classId, nextClassId);

    //         // if (currentplVid === classId) {
    //         // axios
    //         //   .put(
    //         //     reqs.UPDATE_DONE_CLASS,
    //         //     {
    //         //       courseId,
    //         //       nextClassId: nextClassId,
    //         //       currentClassId: classId,
    //         //     },
    //         //     { withCredentials: true }
    //         //   )
    //         //   .then((res) => {
    //         //     if (res.data.succeed) {
    //         //       localStorage.removeItem('cp');
    //         //     }
    //         //   })
    //         //   .catch((err) => {
    //         //     console.log(err);
    //         //   });
    //       }
    //     }
    //   }
    // }
  }, [duration, currentTime, lastSavedDuration, lockedTimeDuration]);

  useEffect(() => {
    console.log('VIDEO: ', videoId);
    // Store ref value at the start of effect
    const playerElement = playerDivRef.current;

    const initializeYouTubePlayer = (): void => {
      // Create a new YouTube player
      const player = new window.YT.Player(playerDivRef.current, {
        videoId: videoId,
        playerVars: {
          fs: 0,
          controls: 0,
          rel: 0, // Don't show related videos
          modestbranding: 1,
          iv_load_policy: 3, // Hide annotations
          showinfo: 0, // Hide video info
          disablekb: 1, // Disable keyboard controls to prevent issues
          cc_load_policy: 0, // Don't show captions by default
        },
        events: {
          onReady: onPlayerReady,
          onStateChange: onPlayerStateChange,
          onpause: togglePlay,
          onplay: togglePlay,
        },
      });

      // Expose the player instance if needed
      // You can use this reference to control the player (play, pause, seek, etc.)
      playerRef.current = player;

      // Add event listener to disable right-click context menu
      playerElement?.addEventListener('contextmenu', handlecontext);
      window.addEventListener('contextmenu', handlecontext);
      window.addEventListener('keydown', handlecontext);
    };

    // Check if YouTube API is already loaded
    if (window.YT && window.YT.Player) {
      // API is already loaded, initialize immediately
      initializeYouTubePlayer();
    } else {
      // Check if script is already in document
      const existingScript = document.querySelector(
        'script[src="https://www.youtube.com/iframe_api"]'
      );

      if (!existingScript) {
        // Load the YouTube API script
        const script = document.createElement('script');
        script.src = 'https://www.youtube.com/iframe_api';
        document.body.appendChild(script);
      }

      // Define functions for YouTube API callbacks
      window.onYouTubeIframeAPIReady = initializeYouTubePlayer;
    }

    // Cleanup on component unmount
    return () => {
      // Store player ref value for cleanup
      const player = playerRef.current;

      // Destroy the player instance
      if (player && typeof player.destroy === 'function') {
        player.destroy();
      }
      playerRef.current = null;

      playerElement?.removeEventListener('contextmenu', handlecontext);
      window.removeEventListener('contextmenu', handlecontext);
      window.removeEventListener('keydown', handlecontext);
    };
  }, [videoId]);

  const handlecontext = (e: Event): void => {
    e.preventDefault();
    return;
  };
  const pauseVideo = (): void => {
    if (playerRef.current) playerRef.current?.pauseVideo();
  };
  const playVideo = (): void => {
    // console.log(playerRef);

    if (playerRef.current) playerRef.current?.playVideo();
  };
  const onPlayerReady = (event: YTPlayerEvent): void => {
    // You can perform actions when the player is ready
    // For example, you can play the video:
    const dur: number = event.target.getDuration();
    const customTitle: string | null = localStorage.getItem('customTitle');
    setTitle(customTitle ? customTitle : 'Record Class');
    setDuration(dur);
  };

  const onPlayerStateChange = (_event: YTPlayerStateChangeEvent): void => {
    setInterval(() => {
      setCurrentTime(playerRef.current?.getCurrentTime() ?? 0);
    }, 1000);
  };

  const forwardVideo = (): void => {
    const newTime: number = (playerRef.current?.getCurrentTime() ?? 0) + 10;
    playerRef.current?.seekTo(newTime, true);
  };
  const backwardVideo = (): void => {
    const newTime: number = (playerRef.current?.getCurrentTime() ?? 0) - 10;
    playerRef.current?.seekTo(newTime, true);
  };

  const handleSeekChange = useCallback(
    (e: number | string): void => {
      // Handle changes in the seek input range
      const newTime: number = parseFloat(e.toString());
      setCurrentTime(newTime);
      if (playerRef.current) {
        playerRef.current?.seekTo(newTime, true);
        if (!isPlaying) {
          playerRef.current?.pauseVideo();
          setIsPlaying(false);
        }
      }
    },
    [isPlaying]
  );
  const showSpeed = useCallback((): void => {
    setsspeed((pre) => !pre);
  }, []);

  const handleSpeedChange = useCallback(
    (newSpeed: number): void => {
      setSpeed(newSpeed);
      if (playerRef.current) {
        playerRef.current?.setPlaybackRate(newSpeed, true);
      }
      showSpeed();
    },
    [showSpeed]
  );
  const handleQualityChange = useCallback((newQuality: string): void => {
    if (playerRef.current) {
      playerRef.current?.setPlaybackQuality(newQuality);
    }
  }, []);
  const showQuality = useCallback((): void => {
    setsquality((pre) => !pre);
  }, []);

  const controller = useMemo(() => {
    const speeds: number[] = [0.5, 0.75, 1, 1.25, 1.5, 2];
    const qualities: string[] = ['hd720', 'large', 'medium'];

    return (
      <div
        className={`custom-controls p-4 flex justify-between items-center transition-transform md:hover:opacity-100 md:opacity-50 ${
          !showControl ? 'delay-500 translate-y-full md:translate-y-0' : 'translate-y-0'
        } `}
        style={{
          zIndex: '50',
        }}
      >
        {/* duration shower */}
        <div
          className="text-sm select-none p-2 flex items-center justify-center rounded-md gap-3"
          style={{
            backgroundColor: '#0872fd',
          }}
        >
          <PPButton
            Click={togglePlay}
            isPlaying={isPlaying}
            pauseVideo={pauseVideo}
            playVideo={playVideo}
          />
          <span>{`${convertTime(currentTime).m}:${convertTime(currentTime).s}`}</span>
          <span>{'/'}</span>
          <span>{`${convertTime(duration).m}:${convertTime(duration).s}`}</span>
        </div>
        {/* just hidding the playback seek panel */}

        <ProgessBar
          currentTime={currentTime}
          duration={duration}
          handleSeekChange={handleSeekChange}
          lockedStartTime={lastSavedDuration} //locakedsavedData represents the current state of the lastsavedData....for user efficiency only
          lockProgressBar={lockProgressBar}
        />

        <div className="flex gap-4 items-center justify-evenly">
          {/* forward of backward */}

          <div className="text-sm flex gap-3 justify-center">
            <button onClick={backwardVideo}>
              <FaBackward />
            </button>
            <button onClick={forwardVideo}>
              <FaForward />
            </button>
          </div>
          {/* other controller vidSetting*/}
          <div className="flex gap-1">
            {/* speed control */}
            <div className="relative">
              <button className="text-xs w-fit" onClick={showSpeed}>
                Speed
              </button>
              <ul onClick={showSpeed} className="absolute left-2">
                {sspeed &&
                  speeds.map((ele, id) => {
                    return (
                      <li
                        className={`speed ${speed === ele && 'bg-blue-700 text-white'}`}
                        key={id}
                        onClick={() => {
                          handleSpeedChange(ele);
                          showSpeed();
                        }}
                      >
                        {`${ele}x`}
                      </li>
                    );
                  })}
              </ul>
            </div>

            {/* quality control */}
            <div className="relative hidden">
              <button className="w-fit text-xs" onClick={showQuality}>
                Quality
                <ul className="absolute left-2" onClick={showQuality}>
                  {squality &&
                    qualities.map((ele, id) => {
                      return (
                        <li
                          className="speed"
                          key={id}
                          onClick={() => {
                            handleQualityChange(ele);
                            showQuality();
                          }}
                        >
                          {ele}
                        </li>
                      );
                    })}
                </ul>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }, [
    speed,
    showControl,
    duration,
    currentTime,
    isPlaying,
    handleSeekChange,
    lastSavedDuration,
    lockProgressBar,
    handleSpeedChange,
    sspeed,
    squality,
    showSpeed,
    showQuality,
    handleQualityChange,
  ]);

  return (
    <div
      className={`video-container`}
      onContextMenu={(e) => e.preventDefault()}
      onKeyDown={(e) => {
        if (e.key === 'F12' || (e.ctrlKey && e.shiftKey && e.key === 'I') || e.key === 'Tab') {
          e.preventDefault();
        }
      }}
      onKeyDownCapture={(e) => {
        if (e.key === 'F12' || (e.ctrlKey && e.shiftKey && e.key === 'I') || e.key === 'Tab') {
          e.preventDefault();
        }
      }}
    >
      {/* <HistoryBackBtn /> */}
      <div
        ref={playerDivRef}
        onContextMenu={(e) => e.preventDefault()}
        onKeyDown={(e) => {
          if (e.key === 'F12' || (e.ctrlKey && e.shiftKey && e.code === 'I') || e.key === 'Tab') {
            e.preventDefault();
          }
        }}
      />
      {/* video default control blocker */}
      <div
        className="blockbefore transition"
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          backgroundColor: !isPlaying ? '#1116' : '#0000',
          zIndex: '10',
          pointerEvents: 'all',
        }}
        onClick={toggleControl}
      />
      <div
        className={`centerController ${
          !showControl ? (!isPlaying ? 'active' : 'hide') : 'active'
        } `}
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: '20',
        }}
      >
        <PPButton
          Click={togglePlay}
          isPlaying={isPlaying}
          pauseVideo={pauseVideo}
          playVideo={playVideo}
        />
      </div>
      <div
        className="customHeader transition-opacity duration-100 ease-out"
        style={{
          zIndex: '100',
          background: isPlaying ? '#fff1' : '',
          opacity: isPlaying ? '0.5' : '1',
          transitionProperty: 'background',
          transitionDelay: '300ms',
        }}
      >
        <p
          className={`transition-colors pl-3 duration-300 delay-500 ${
            isPlaying ? 'text-transparent' : ''
          }`}
        >
          {title}
        </p>
      </div>
      {controller}
    </div>
  );
};

export { YTPlayer };

function PPButton({ isPlaying, Click, playVideo, pauseVideo }: PPButtonProps) {
  return (
    <PPIcon isPlaying={isPlaying} playVideo={playVideo} pauseVideo={pauseVideo} Click={Click} />
  );
}

function ProgessBar({
  currentTime = 0,
  duration = 1,
  handleSeekChange,
  lockedStartTime,
  lockProgressBar,
}: ProgressBarProps) {
  const handleClick = (e: React.MouseEvent<HTMLLabelElement | HTMLInputElement>): void => {
    const progressBar = e.target as HTMLElement;
    const { left, width } = progressBar.getBoundingClientRect();
    const clickX: number = e.clientX - left;
    const newTime: number = (clickX / width) * duration;

    // Allow seeking only if newTime is before the locked area
    if (newTime < lockedStartTime + 10 || !lockProgressBar) {
      handleSeekChange(newTime);
    }
  };

  const handleContinuousChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const newTime: number = parseFloat(e.target.value);

    // Allow seeking only if newTime is before the locked area
    if (newTime < lockedStartTime + 10 || !lockProgressBar) {
      handleSeekChange(newTime);
    }
  };
  return null;
  return (
    <>
      <label
        className="w-full h-1 rounded-full z-30 bg-blue-500/50 hover:bg-blue-400/60 transition-colors absolute cursor-pointer -top-1 left-0 hidden"
        htmlFor="vidRange"
        onClick={handleClick} // Handle click to seek
      >
        <span
          className={`absolute w-full h-full left-0 top-0 bg-white rounded-full shadow shadow-blue-200 pointer-events-none`}
          style={{
            transform: `translateX(${(currentTime / duration) * 100 - 100}%)`,
          }}
        ></span>
      </label>
      <input
        className="w-full h-1 rounded-full bg-blue-500/50 -z-10 hover:bg-blue-400/60 transition-colors absolute cursor-pointer -top-1 left-0"
        type="range"
        name="vidRange"
        min={0}
        max={duration}
        step={0.5}
        value={currentTime}
        onClick={handleClick}
        onChange={(e) => {
          // if (currentTime < lockedStartTime) handleSeekChange(e.target.value);
          handleContinuousChange(e);
        }}
      />
      {/* Create a visual representation of the locked area */}
      {lockProgressBar && (
        <div
          hidden
          className="absolute -z-10 bg-opacity-40 bg-black h-1.5 rounded-full"
          style={{
            left: `${(lockedStartTime / duration) * 100 + 2}%`, // Start of locked area
            width: `${100 - (lockedStartTime / duration) * 100}%`, // Width of locked area to end
            top: '-12%',
          }}
        />
      )}
    </>
  );
}

function PPIcon({ isPlaying, playVideo, pauseVideo, Click }: PPIconProps) {
  if (!isPlaying)
    return (
      <button
        onClick={() => {
          playVideo();
          Click();
        }}
      >
        <FaPlayCircle />
      </button>
    );
  else
    return (
      <button
        onClick={() => {
          Click();
          pauseVideo();
        }}
      >
        <FaPauseCircle />
      </button>
    );
}
function convertTime(timeInSecond: number = 0): TimeObject {
  const m: string | number = addPrefix(Math.floor(timeInSecond / 60));
  const s: string | number = addPrefix(Math.floor(timeInSecond - Number(m) * 60));
  const time: TimeObject = { m, s };
  return time;
}
function addPrefix(val: number): string | number {
  return val < 10 ? `0${val}` : val;
}

// const HistoryBackBtn: React.FC = () => {
//   return (
//     <button
//       className="fixed z-50 top-5 right-5 bg-white grid place-content-center"
//       onClick={() => {
//         window.history.back();
//       }}
//     >
//       <MdClose color="white" />
//     </button>
//   );
// };
