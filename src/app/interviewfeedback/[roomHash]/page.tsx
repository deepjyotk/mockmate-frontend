/* eslint-disable */

import InterviewFeedbackClient from "@/components/feedback/InterviewFeedbackClient";

interface Props {
  params: {
    roomHash: string;
  };
}

const InterviewFeedbackPage = async ({ params }: { params: Promise<{ roomHash: string }> }) => {
  const resolvedParams = await params;

  console.log("room hash:", resolvedParams.roomHash);

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gray-100 text-gray-800">
      <InterviewFeedbackClient roomID={resolvedParams.roomHash} />
    </div>
  );
};

export default InterviewFeedbackPage;
