import InterviewFeedbackClient from "@/components/feedback/InterviewFeedbackClient";



interface Params {
  roomHash: string;
}

const InterviewFeedbackPage = async ({ params }: { params: Params; }) => {

    // const { roomHash } = useParams(); // Access the dynamic route parameter

console.log("room hash:" + params.roomHash);
  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gray-100 text-gray-800">
        <InterviewFeedbackClient roomID={params.roomHash} />
    </div>
  );
};

export default InterviewFeedbackPage;