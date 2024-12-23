'use server';

import InterviewLayout from '@/components/room/InterviewLayout';
import { GetRoomPayloadResponse } from '@/models/room/GetRoomPayloadResponse';
import serverComponentFetchRequest from '@/services/serverComponentFetchRequest';

interface Params {
  roomId: string;
  interviewId: string;
}

interface SearchParams {
  role?: string;
}

const fetchRoomDetails = async (interviewId: string, roomId: string) => {
  const res = await serverComponentFetchRequest(
    `room/getRoomPayloadForInterview/${interviewId}/${roomId}`
  );
  return res;
};

const InterviewPage = async ({
  params: paramsPromise,
  searchParams: searchParamsPromise,
}: {
  params: Promise<Params>;
  searchParams: Promise<SearchParams>;
}) => {
  // Resolve promises
  const params = await paramsPromise;
  const searchParams = await searchParamsPromise;

  const { roomId, interviewId } = params;

  const data = await fetchRoomDetails(interviewId, roomId);

  if ('error' in data) {
    console.error(`Failed to fetch data: ${data.message}`);
    return <div>Error: Failed to fetch data</div>;
  }

  const roomPayload: GetRoomPayloadResponse = data.payload as GetRoomPayloadResponse;

  return (
    <div className="min-h-screen bg-gray-100">
      <InterviewLayout
        roomId={roomId}
        interviewId={interviewId}
        roomPayload={roomPayload}
      />
    </div>
  );
};

export default InterviewPage;
