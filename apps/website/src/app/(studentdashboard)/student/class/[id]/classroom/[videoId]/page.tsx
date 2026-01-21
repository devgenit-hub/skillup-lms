'use client';
import { YTPlayer } from '@/components/YTPlayer/YTPlayer';
import React from 'react';
import { useParams, useSearchParams } from 'next/navigation';
function VideoPlayback() {
  const { videoId } = useParams();
  const searchParams = useSearchParams();
  const ct = searchParams.get('ct');

  if (!videoId || Array.isArray(videoId)) {
    return <></>;
  }

  return <>{videoId?.length > 0 && <YTPlayer videoId={videoId} ct={ct} />}</>;
}

export default VideoPlayback;
