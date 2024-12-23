"use client";

import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  initializeScheduleState,
  mapModelToState,
  Status,
  decrementAllCountdowns,
} from "@/redux/slices/home/upcomingInterviewSectionSlice";
import { UserSpecificUpcomingInterviewModel } from "@/models/interview/specific/UserSpecificUpcomingInterviewModel";
import ErrorAlertBanner from "../exception/alert-banners/ErrorAlertBanner";
import { motion, AnimatePresence } from "framer-motion";

interface UpcomingInterviewSectionProps {
  data: UserSpecificUpcomingInterviewModel[];
}

const UpcomingInterviewSection: React.FC<UpcomingInterviewSectionProps> = ({
  data,
}) => {
  const dispatch = useAppDispatch();

  const { upcomingInterviews, status, error } = useAppSelector(
    (state) => state.upcomingInterviewSection
  );

  useEffect(() => {
    if (data && data.length > 0) {
      const mappedData = mapModelToState(data);
      dispatch(initializeScheduleState(mappedData));
    }
  }, [data, dispatch]);

  useEffect(() => {
    const timer = setInterval(() => {
      dispatch(decrementAllCountdowns());
    }, 1000);

    return () => clearInterval(timer);
  }, [dispatch]);

  const clickQuestion = (questionID: string) => {
    if (questionID) {
      const customUrl = `/view-question/${questionID}`;
      window.open(customUrl, "_blank");
    } else {
      console.warn("Something went wrong");
    }
  };
  const clickJoinInterview = (interviewId: string) => {
    if (interviewId) {
      const customUrl = `/waiting-room/${interviewId}`;
      window.location.href = customUrl;
    }
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
        Upcoming Interviews
      </h2>

      {/* Display Error Message if Exists */}
      {status === Status.Error && <ErrorAlertBanner error={error} />}

      {/* Display Loading Indicator */}
      {status === Status.Loading && (
        <div className="text-center text-blue-500">Loading...</div>
      )}

      {/* Display the Table Regardless of Status (but content may vary) */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-blue-100">
              <th className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">
                Date & Time
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">
                Question For Peer
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {upcomingInterviews.length > 0 ? (
                upcomingInterviews.map((interview) => (
                  <motion.tr
                    key={interview.interviewId}
                    className="border-t"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-200 text-blue-800">
                        {interview.interviewType.interviewTypeTitle}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {interview.interviewDateAndTime}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 hover:underline">
                      {interview.upcomingInterviewQuestionForPeer.questionTitle !== "TBA" ? (
                        <button
                          onClick={() =>
                            clickQuestion(
                              interview.upcomingInterviewQuestionForPeer.questionID
                            )
                          }
                        >
                          {interview.upcomingInterviewQuestionForPeer.questionTitle}
                        </button>
                      ) : (
                        "TBA"
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {interview.reverseCountdownText === "Join Interview" ? (
                        <motion.button
                          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => clickJoinInterview(interview.interviewId)}
                        >
                          {interview.reverseCountdownText}
                        </motion.button>
                      ) : (
                        <span className="text-gray-500">{interview.reverseCountdownText}</span>
                      )}
                    </td>
                  </motion.tr>
                ))
              ) : status === Status.Success && upcomingInterviews.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    No upcoming interviews available.
                  </td>
                </tr>
              ) : null}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default UpcomingInterviewSection;
