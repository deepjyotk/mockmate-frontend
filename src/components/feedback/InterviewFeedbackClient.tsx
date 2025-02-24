'use client';

import { FeedbackRequestModel } from "@/models/feedback/FeedbackRequestModel";
import { axiosPostRequest } from "@/services/axiosService";
import { useRouter } from "next/navigation";
import { useState, FormEvent } from "react";
import { FaStar } from "react-icons/fa";

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

interface StarRatingProps {
  rating: number;
  onChange: (rating: number) => void;
  optional?: boolean;
}

const StarRating: React.FC<StarRatingProps> = ({ rating, onChange, optional = false }) => {
  const stars = Array.from({ length: 5 }, (_, i) => i + 1);
  return (
    <div className="flex space-x-1">
      {stars.map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          className="focus:outline-none"
        >
          <FaStar
            className={`transition-colors duration-200 text-2xl ${
              star <= rating ? "text-yellow-400" : "text-gray-300"
            }`}
          />
        </button>
      ))}
      {optional && rating === 0 && (
        <span className="text-sm text-gray-500 italic">(Optional)</span>
      )}
    </div>
  );
};

const InterviewFeedbackClient: React.FC<InterviewFeedbackClientProps> = ({ roomID }) => {
  const [communicationSkillsRating, setCommunicationSkillsRating] = useState<number>(3);
  const [technicalSkillsRating, setTechnicalSkillsRating] = useState<number>(0); // 0 means not set
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
        technicalSkillsRating: technicalSkillsRating === 0 ? undefined : technicalSkillsRating,
        didWellText,
        thingsToImproveText,
        nextRoundSelection,
        goodMatchForPeerRating,
      },
    };

    const response = await axiosPostRequest('/interviews/feedback', feedbackData);

    if ("error" in response) {
      router.replace('/');
      console.error("Failed to submit feedback:", response.error);
      return;
    } else {
      router.replace('/');
      return;
    }
  };

  return (
    <div className="bg-white shadow-xl rounded-lg p-8 w-full max-w-lg mx-auto mt-10">
      <h2 className="text-2xl font-bold text-center mb-6">How did your peer perform? (Please provide feedback)</h2>
      <form onSubmit={submitFeedback} className="flex flex-col space-y-6">
        {/* Communication Skills */}
        <div>
          <label className="block font-semibold mb-2">
            Communication Skills Rating
          </label>
          <StarRating rating={communicationSkillsRating} onChange={setCommunicationSkillsRating} />
        </div>

        {/* Technical Skills */}
        <div>
          <label className="block font-semibold mb-2">
            Technical Skills Rating (Optional)
          </label>
          <StarRating rating={technicalSkillsRating} onChange={setTechnicalSkillsRating} optional />
        </div>

        {/* What did they do well? */}
        <div>
          <label className="block font-semibold mb-2">What did they do well?</label>
          <textarea
            placeholder="Share what impressed you..."
            value={didWellText}
            onChange={(e) => setDidWellText(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            rows={4}
          />
        </div>

        {/* Areas for Improvement */}
        <div>
          <label className="block font-semibold mb-2">Areas for Improvement</label>
          <textarea
            placeholder="Suggestions for improvement..."
            value={thingsToImproveText}
            onChange={(e) => setThingsToImproveText(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            rows={4}
          />
        </div>

        {/* Next Round Selection using Yes/No Buttons */}
        <div className="flex items-center space-x-4">
          <span className="font-semibold">Select for next round?</span>
          <button
            type="button"
            onClick={() => setNextRoundSelection(true)}
            className={`px-4 py-2 rounded transition-colors ${
              nextRoundSelection ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Yes
          </button>
          <button
            type="button"
            onClick={() => setNextRoundSelection(false)}
            className={`px-4 py-2 rounded transition-colors ${
              !nextRoundSelection ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            No
          </button>
        </div>

        {/* Good Match Rating */}
        <div>
          <label className="block font-semibold mb-2">
            Good Match Rating for Peer
          </label>
          <StarRating rating={goodMatchForPeerRating} onChange={setGoodMatchForPeerRating} />
        </div>

        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors"
        >
          Submit Feedback
        </button>
      </form>
    </div>
  );
};

export default InterviewFeedbackClient;
