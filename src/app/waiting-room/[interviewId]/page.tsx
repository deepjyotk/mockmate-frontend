import WaitingRoomClient from "@/components/waiting-room/waiting-room-client";


interface Params {
  interviewId: string; 
}
const WaitingRoomPage = async ({params: promiseParams}: {
  params: Promise<Params>;
}) => {
  const params = await promiseParams;

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gray-100 text-gray-800">
      <WaitingRoomClient interviewId={params.interviewId} />
    </div>
  );
};

export default WaitingRoomPage;