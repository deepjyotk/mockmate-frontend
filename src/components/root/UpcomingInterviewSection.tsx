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
      upcomingInterviews.forEach(() => {
        dispatch(decrementAllCountdowns());
      });
    }, 1000);

    return () => clearInterval(timer); // Cleanup on component unmount
  }, [dispatch, upcomingInterviews]);

  const clickQuestion = (questionID: string) => {
    if (questionID) {
      const customUrl = `/view-question/${questionID}`;
      window.open(customUrl, "_blank");
    } else {
      console.warn("Went wrong "); 
    }
  };
  const clickJoinInterview = (interviewId: string) => {
    if(interviewId){
      const customUrl = `/waiting-room/${interviewId}`; 
      window.location.href = customUrl;
    }
  };

  return (
    <div className="container mx-auto p-8 font-sans">
      <h2 className="text-2xl font-bold text-center mb-6">
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
        <table className="table-auto w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2 text-left">
                Type
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left">
                Date & Time
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left">
                Question For Peer
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left">
                
              </th>
            </tr>
          </thead>
          <tbody>
            {upcomingInterviews.length > 0 ? (
              upcomingInterviews.map((interview) => (
                <tr
                  key={interview.interviewId}
                  className="odd:bg-white even:bg-gray-50"
                >
                  <td className="border border-gray-300 px-4 py-2">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                      {interview.interviewType.interviewTypeTitle}
                    </span>
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {interview.interviewDateAndTime}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    { interview.upcomingInterviewQuestionForPeer
                            .questionTitle !="TBA"  ? (
                      <button
                        onClick={() =>
                          clickQuestion(
                            interview.upcomingInterviewQuestionForPeer
                              .questionID
                          )
                        }
                        className="text-blue-500 underline hover:text-blue-700"
                      >
                        {
                          interview.upcomingInterviewQuestionForPeer
                            .questionTitle
                        }
                      </button>
                    ) : (
                      "TBA"
                    )}
                  </td>

                  <td className="border border-gray-300 px-4 py-2">
                    {interview.reverseCountdownText === "Join Interview" ? (
                      <button
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
                        onClick={() => clickJoinInterview(interview.interviewId) }
                      >
                        {interview.reverseCountdownText}
                      </button>
                    ) : (
                      <span>{interview.reverseCountdownText}</span>
                    )}
                  </td>
                </tr>
              ))
            ) : status === Status.Success && upcomingInterviews.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="border border-gray-300 px-4 py-2 text-center text-gray-500"
                >
                  No upcoming interviews available.
                </td>
              </tr>
            ) : (
              // Optionally, you can render nothing or a placeholder when not in success state
              <tr>
                <td
                  colSpan={4}
                  className="border border-gray-300 px-4 py-2 text-center text-gray-500"
                >
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UpcomingInterviewSection;
