"use client";
import React, { useEffect, useState } from "react";
import { PastInterviewsModel } from "@/models/interview/specific/PastInterviewsModel";
import {
  FeedbackByPeerState,
  initializeScheduleState,
  mapModelToState,
  PastInterviewState,
  Status,
} from "@/redux/slices/home/pastInterviewSectionSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import FeedbackModal from "./FeedbackModal";
import { motion, AnimatePresence } from "framer-motion";

interface PastInterviewsTableProps {
  data: PastInterviewsModel;
}

const PastInterviewsTable: React.FC<PastInterviewsTableProps> = ({ data }) => {
  const dispatch = useAppDispatch();
  const { results, status } = useAppSelector(
    (state) => state.pastInterviewSection
  );

  const [showModal, setShowModal] = useState(false);
  const [selectedFeedback, setSelectedFeedback] =
    useState<FeedbackByPeerState | null>(null);

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
    <motion.div
      className="container mx-auto p-8 font-sans"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <h2 className="text-3xl font-bold text-center mb-6 text-primary">
        Past Interviews
      </h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-blue-100">
              <th className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">
                Date & Time
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">
                Question
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">
                Peer User
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">
                Feedback
              </th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {results.length > 0 ? (
                results.map((interview: PastInterviewState) => (
                  <motion.tr
                    key={interview.pastInterviewID}
                    className="border-t cursor-pointer hover:bg-gray-100"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {interview.pastInterviewDateAndTime}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {interview.pastInterviewType}
                    </td>
                    <td>
                      {interview.questionForMe ? (
                        <motion.button
                          onClick={() => {
                            if (interview.questionForMe?.questionId) {
                              clickQuestion(interview.questionForMe.questionId);
                            }
                          }}
                        >
                          {interview.questionForMe.questionTitle || ""}
                        </motion.button>
                      ) : null}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {interview.peerUser.peerUserName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {interview.feedbackGiven ? (
                        interview.feedbackByPeer ? (
                          <motion.button
                            className="text-blue-500 underline hover:text-blue-700"
                            onClick={() =>
                              openFeedbackModal(interview.feedbackByPeer!)
                            }
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            View Feedback
                          </motion.button>
                        ) : (
                          <span className="text-gray-500">
                            Waiting for Peer&apos;s Feedback
                          </span>
                        )
                      ) : (
                        <motion.button
                          className="text-blue-500 underline hover:text-blue-700"
                          onClick={() => goToFeedback(interview.roomIDHash)}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          Feedback Pending
                        </motion.button>
                      )}
                    </td>
                  </motion.tr>
                ))
              ) : status === Status.Success && results.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    No past interviews available.
                  </td>
                </tr>
              ) : null}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      {/* Feedback Modal */}
      <AnimatePresence>
        {showModal && selectedFeedback && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-lg p-6 w-11/12 max-w-lg"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <FeedbackModal feedback={selectedFeedback} onClose={closeModal} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default PastInterviewsTable;
