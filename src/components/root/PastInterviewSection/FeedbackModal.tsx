import { FeedbackByPeerState } from "@/redux/slices/home/pastInterviewSectionSlice";
import React from "react";


interface FeedbackModalProps {
  feedback: FeedbackByPeerState;
  onClose: () => void;
}

const FeedbackModal: React.FC<FeedbackModalProps> = ({ feedback, onClose }) => {
  const {
    communicationSkillsRating,
    technicalSkillsRating,
    didWellText,
    thingsToImproveText,
    nextRoundSelection,
    goodMatchForPeerRating
  } = feedback;

  // Helper function to render stars from a string rating
  const renderStars = (ratingString: string | undefined): JSX.Element | null => {
    if (!ratingString) return null;

    const ratingValue = parseInt(ratingString, 10);
    if (isNaN(ratingValue) || ratingValue < 1 || ratingValue > 5) {
      return null; // Invalid rating, skip
    }

    const maxRating = 5;
    const stars = [];
    for (let i = 1; i <= maxRating; i++) {
      stars.push(
        <span key={i} className={i <= ratingValue ? "text-yellow-500" : "text-gray-300"}>
          {i <= ratingValue ? "★" : "☆"}
        </span>
      );
    }

    return <div className="inline-block text-2xl">{stars}</div>;
  };

  // Render a single rating line with label if the rating is valid
  const renderRatingLine = (label: string, ratingString: string | undefined) => {
    const stars = renderStars(ratingString);
    if (!stars) return null; // no valid rating
    return (
      <div className="mb-4 text-center">
        <p className="font-semibold mb-1">{label}</p>
        {stars}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black opacity-50" onClick={onClose}></div>

      {/* Modal content */}
      <div className="relative bg-white rounded-lg shadow-lg w-full max-w-md mx-4 p-6 z-10">
        <h3 className="text-xl font-semibold mb-4 text-center">Interview Feedback</h3>

        {/* Ratings Section */}
        {renderRatingLine("Communication Skills", communicationSkillsRating)}
        {renderRatingLine("Technical Skills", technicalSkillsRating)}
        {renderRatingLine("Good Match for Peer", goodMatchForPeerRating)}

        {/* Text Feedback */}
        {didWellText && didWellText.trim().length > 0 && (
          <div className="mb-4">
            <p className="font-semibold mb-1">What They Did Well</p>
            <p className="text-gray-700">{didWellText}</p>
          </div>
        )}

        {thingsToImproveText && thingsToImproveText.trim().length > 0 && (
          <div className="mb-4">
            <p className="font-semibold mb-1">Things to Improve</p>
            <p className="text-gray-700">{thingsToImproveText}</p>
          </div>
        )}

        {/* Next Round Selection */}
        <div className="mb-4">
          <p className="font-semibold mb-1">Next Round Selection</p>
          {nextRoundSelection ? (
            <p className="text-green-600">Candidate selected for the next round.</p>
          ) : (
            <p className="text-red-600">Candidate not selected for the next round.</p>
          )}
        </div>

        {/* If no content is displayed at all (no ratings, no texts), show a fallback */}
        {!communicationSkillsRating && 
         !technicalSkillsRating && 
         !goodMatchForPeerRating && 
         (!didWellText || didWellText.trim().length === 0) && 
         (!thingsToImproveText || thingsToImproveText.trim().length === 0) && (
          <div className="mb-4">
            <p className="text-gray-500 text-center">No feedback details available.</p>
          </div>
        )}

        <div className="flex justify-center">
          <button
            onClick={onClose}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default FeedbackModal;
