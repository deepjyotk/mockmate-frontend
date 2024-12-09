import WaitingRoomClient from "@/components/waiting-room/waiting-room-client";

const WaitingRoomPage = ({ params }: { params: { interviewId: string } }) => {
  const { interviewId } = params;

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gray-100 text-gray-800">
      <WaitingRoomClient interviewId={interviewId} />
    </div>
  );
};

export default WaitingRoomPage;