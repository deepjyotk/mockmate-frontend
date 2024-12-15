'use client';
import React, { useEffect } from "react";
import { PastInterviewsModel } from "@/models/interview/specific/PastInterviewsModel";
import { initializeScheduleState, mapModelToState } from "@/redux/slices/home/pastInterviewSectionSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";

interface PastInterviewsTableProps {
  data: PastInterviewsModel;
}

const PastInterviewsTable: React.FC<PastInterviewsTableProps> = ({ data }) => {
  const dispatch = useAppDispatch();

  const { page,
    limit,
    totalListings,
    totalPages,
    results,
    status,
    error} = useAppSelector(
    (state) => state.pastInterviewSection
  );
  useEffect(() => {
    if (data ) {
      const mappedData = mapModelToState(data);
      dispatch(initializeScheduleState(mappedData));
    }
  }, [data, dispatch]);


  const clickQuestion = (questionID: string) => {
    if (questionID) {
      const customUrl = `/view-question/${questionID}`;
      window.open(customUrl, "_blank");
    } else {
      console.warn("Went wrong "); 
    }
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
            </tr>
          </thead>
          <tbody>
            {results.length > 0 ? (
              results.map((interview) => (
                <tr key={interview.pastInterviewID} className="odd:bg-white even:bg-gray-50">
                  <td className="border border-gray-300 px-4 py-2">
                    {interview.pastInterviewDateAndTime}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">{interview.pastInterviewType}</td>
                  <td className="border border-gray-300 px-4 py-2">
                  <button
                        onClick={() =>
                          clickQuestion(
                            interview.questionForMe
                              .questionId
                          )
                        }
                        className="text-blue-500 underline hover:text-blue-700"
                      >
                        {
                          interview.questionForMe.questionTitle
                        }
                      </button>
                  </td>
                  <td className="border border-gray-300 px-4 py-2">{interview.peerUser.peerUserName}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={4} // Fixed to 4 columns instead of 5 to match the number of columns in the table
                  className="border border-gray-300 px-4 py-2 text-center text-gray-500"
                >
                  No past interviews available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PastInterviewsTable;
