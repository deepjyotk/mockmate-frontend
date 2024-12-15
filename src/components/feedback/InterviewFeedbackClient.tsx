'use client';
import { FeedbackRequestModel } from "@/models/feedback/FeedbackRequestModel";
import { axiosPostRequest } from "@/services/axiosService";
import { useRouter } from "next/navigation";
import { useState, FormEvent } from "react";

export interface PeerFeedbackDTO {
  communicationSkillsRating: number; // 1-5
  technicalSkillsRating?: number; // 1-5 (optional)
  didWellText: string;
  thingsToImproveText: string;
  nextRoundSelection: boolean;
  goodMatchForPeerRating: number; 
}

export interface FeedbackRequestDTO {
  roomHash: string;
  peerFeedback: PeerFeedbackDTO;
}

interface InterviewFeedbackClientProps {
  roomID: string;
}

const InterviewFeedbackClient: React.FC<InterviewFeedbackClientProps> = ({ roomID }) => {

  const [communicationSkillsRating, setCommunicationSkillsRating] = useState<number>(3);
  const [technicalSkillsRating, setTechnicalSkillsRating] = useState<number | undefined>(3);
  const [didWellText, setDidWellText] = useState<string>("");
  const [thingsToImproveText, setThingsToImproveText] = useState<string>("");
  const [nextRoundSelection, setNextRoundSelection] = useState<boolean>(false);
  const [goodMatchForPeerRating, setGoodMatchForPeerRating] = useState<number>(3);
  const router = useRouter();

  const submitFeedback = async (e: FormEvent) => {
    e.preventDefault();

    const feedbackData: FeedbackRequestModel = {
      roomHash: roomID,
      peerFeedback: {
        communicationSkillsRating,
        technicalSkillsRating,
        didWellText,
        thingsToImproveText,
        nextRoundSelection,
        goodMatchForPeerRating,
      },
    };


    const response = await axiosPostRequest('/interviews/feedback',feedbackData) ;

    if ("error" in response){
      router.replace('/');
      console.error("Failed to submit feedback:");
      return ;
    }else{
      router.replace('/');
      return ;
    }
  };
  return (
    <div className="bg-white shadow-lg rounded p-6 w-full max-w-lg">
      <form onSubmit={submitFeedback} className="flex flex-col space-y-4">

        <div>
          <label className="block font-semibold mb-1" htmlFor="communicationSkillsRating">Communication Skills Rating (1-5)</label>
          <input
            type="number"
            id="communicationSkillsRating"
            min={1}
            max={5}
            value={communicationSkillsRating}
            onChange={(e) => setCommunicationSkillsRating(Number(e.target.value))}
            className="border border-gray-300 rounded px-3 py-2 w-full"
          />
        </div>

        <div>
          <label className="block font-semibold mb-1" htmlFor="technicalSkillsRating">Technical Skills Rating (1-5, optional)</label>
          <input
            type="number"
            id="technicalSkillsRating"
            min={1}
            max={5}
            value={technicalSkillsRating ?? ""}
            onChange={(e) => {
              const val = e.target.value;
              setTechnicalSkillsRating(val === "" ? undefined : Number(val));
            }}
            className="border border-gray-300 rounded px-3 py-2 w-full"
          />
        </div>

        <div>
          <label className="block font-semibold mb-1" htmlFor="didWellText">What did they do well?</label>
          <textarea
            id="didWellText"
            value={didWellText}
            onChange={(e) => setDidWellText(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2 w-full"
          />
        </div>

        <div>
          <label className="block font-semibold mb-1" htmlFor="thingsToImproveText">Things to improve</label>
          <textarea
            id="thingsToImproveText"
            value={thingsToImproveText}
            onChange={(e) => setThingsToImproveText(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2 w-full"
          />
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="nextRoundSelection"
            checked={nextRoundSelection}
            onChange={(e) => setNextRoundSelection(e.target.checked)}
            className="h-4 w-4"
          />
          <label htmlFor="nextRoundSelection" className="font-semibold">Select for next round?</label>
        </div>

        <div>
          <label className="block font-semibold mb-1" htmlFor="goodMatchForPeerRating">Good Match Rating for Peer (1-5)</label>
          <input
            type="number"
            id="goodMatchForPeerRating"
            min={1}
            max={5}
            value={goodMatchForPeerRating}
            onChange={(e) => setGoodMatchForPeerRating(Number(e.target.value))}
            className="border border-gray-300 rounded px-3 py-2 w-full"
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white font-semibold px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Submit Feedback
        </button>
      </form>
    </div>
  );
};

export default InterviewFeedbackClient;