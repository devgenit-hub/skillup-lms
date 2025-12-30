'use client';
import { YTPlayer } from '@/components/YTPlayer/YTPlayer';
import React from 'react';
import { useParams } from 'next/navigation';
function VideoPlayback() {
  const { videoId } = useParams();

  if (!videoId || Array.isArray(videoId)) {
    return <></>;
  }

  return <>{videoId?.length > 0 && <YTPlayer videoId={videoId} />}</>;
}

export default VideoPlayback;
