/* eslint-disable */

import { NextPage } from "next";
import InterviewFeedbackClient from "@/components/feedback/InterviewFeedbackClient";

interface Props {
  params: {
    roomHash: string;
  };
}

const InterviewFeedbackPage: NextPage<Props> = ({ params }) => {
  console.log("room hash:", params.roomHash);

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gray-100 text-gray-800">
      <InterviewFeedbackClient roomID={params.roomHash} />
    </div>
  );
};

export default InterviewFeedbackPage;
