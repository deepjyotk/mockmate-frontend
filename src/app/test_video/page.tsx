// pages/index.js
import VideoCall from '@/components/room/VideoCall';
import React from 'react';

const VideoPage = () => {
  const roomID = 'your_unique_room_id';

  return <VideoCall roomID={roomID} />;
};

export default VideoPage;
