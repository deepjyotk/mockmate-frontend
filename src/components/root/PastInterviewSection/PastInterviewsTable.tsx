'use client';
import React, { useEffect, useState } from "react";
import { PastInterviewsModel } from "@/models/interview/specific/PastInterviewsModel";
import { FeedbackByPeerState, initializeScheduleState, mapModelToState, PastInterviewState } from "@/redux/slices/home/pastInterviewSectionSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import FeedbackModal from "./FeedbackModal";

interface PastInterviewsTableProps {
  data: PastInterviewsModel;
}


const PastInterviewsTable: React.FC<PastInterviewsTableProps> = ({ data }) => {
  const dispatch = useAppDispatch();
  const {
    page,
    limit,
    totalListings,
    totalPages,
    results,
    status,
    error
  } = useAppSelector((state) => state.pastInterviewSection);

  const [showModal, setShowModal] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState<FeedbackByPeerState | null>(null);

  useEffect(() => {
    if (data) {
      const mappedData = mapModelToState(data);
      dispatch(initializeScheduleState(mappedData));
    }
  }, [data, dispatch]);

  const clickQuestion = (questionID: string) => {
    if (questionID) {
      const customUrl = `/view-question/${questionID}`;
      window.open(customUrl, "_blank");
    } else {
      console.warn("Something went wrong");
    }
  };

  const goToFeedback = (roomIDHash: string) => {
    if (roomIDHash) {
      const feedbackUrl = `/interviewfeedback/${roomIDHash}`;
      window.open(feedbackUrl, "_blank");
    } else {
      console.warn("Room ID Hash is missing");
    }
  };

  const openFeedbackModal = (feedback: FeedbackByPeerState) => {
    setSelectedFeedback(feedback);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedFeedback(null);
  };

  return (
    <div className="container mx-auto p-8 font-sans">
      <h2 className="text-2xl font-bold text-center mb-6">Past Interviews</h2>
      <div className="overflow-x-auto">
        <table className="table-auto w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2 text-left">Date & Time</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Type</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Question</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Peer User</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Feedback</th>
            </tr>
          </thead>
          <tbody>
            {results.length > 0 ? (
              results.map((interview: PastInterviewState) => (
                <tr key={interview.pastInterviewID} className="odd:bg-white even:bg-gray-50">
                  <td className="border border-gray-300 px-4 py-2">
                    {interview.pastInterviewDateAndTime}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">{interview.pastInterviewType}</td>
                  <td className="border border-gray-300 px-4 py-2">
                    <button
                      onClick={() => clickQuestion(interview.questionForMe.questionId)}
                      className="text-blue-500 underline hover:text-blue-700"
                    >
                      {interview.questionForMe.questionTitle}
                    </button>
                  </td>
                  <td className="border border-gray-300 px-4 py-2">{interview.peerUser.peerUserName}</td>
                  <td className="border border-gray-300 px-4 py-2">
                    {interview.feedbackGiven ? (
                      interview.feedbackByPeer ? (
                        <button
                          onClick={() => openFeedbackModal(interview.feedbackByPeer!)}
                          className="text-blue-500 underline hover:text-blue-700"
                        >
                          View Feedback
                        </button>
                      ) : (
                        <span>Waiting for Peer's Feedback</span>
                      )
                    ) : (
                      <button
                        onClick={() => goToFeedback(interview.roomIDHash)}
                        className="text-blue-500 underline hover:text-blue-700"
                      >
                        Feedback Pending
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={5}
                  className="border border-gray-300 px-4 py-2 text-center text-gray-500"
                >
                  No past interviews available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Feedback Modal */}
      {showModal && selectedFeedback && (
        <FeedbackModal
          feedback={selectedFeedback}
          onClose={closeModal}
        />
      )}
    </div>
  );
};

export default PastInterviewsTable;
