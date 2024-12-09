'use client';
import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  scheduleInterviewThunk,
  setInterviewType,
  setInterviewLevel,
  setInterviewTime,
  initializeScheduleState,
  mapInitialDataToReduxState,
} from "@/redux/slices/schedule-interview-modal/scheduleSlice";
import StepContent from "./StepContent";
import { InitDataInterviewPayloadModel } from '@/models/interview/init/InterviewPayloadModel';
import { useRouter } from 'next/navigation';

interface InterviewModalProps {
  step: number;
  closeModal: () => void;
  handleNext: () => void;
  handleBack: () => void;
  data: InitDataInterviewPayloadModel;
}

const InterviewModal: React.FC<InterviewModalProps> = ({
  step,
  closeModal,
  handleNext,
  handleBack,
  data,
}) => {
  const dispatch = useAppDispatch();
  const router = useRouter() ;
  const {
    status,
    error,
    interviewType,
    interviewLevel,
    interviewTime,
    interviewTypes,
    difficultyLevels,
    interviewTimes,
  } = useAppSelector((state) => state.schedule);

  useEffect(() => {
    const mappedData = mapInitialDataToReduxState(data);
    dispatch(initializeScheduleState(mappedData));
  }, [data, dispatch]);

  const handleSchedule = () => {
    dispatch(scheduleInterviewThunk())
      .unwrap()
      .then(() => {
        console.log("Interview Scheduled!");
        router.refresh(); // Refresh the page

      
        closeModal();
      })
      .catch((err) => {
        console.error("Failed to schedule:", err);
      });
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <StepContent
            title="Select Interview Type"
            options={interviewTypes.map((type) => ({
              id: type.interviewId,
              label: type.type,
            }))}
            selectedOption={interviewType?.interviewTypeId || null}
            onOptionSelect={(id) => dispatch(setInterviewType(id))}
            handleNext={handleNext}
          />
        );
      case 2:
        return (
          <StepContent
            title="Select Difficulty Level"
            options={difficultyLevels.map((level) => ({
              id: level.interviewLevelId,
              label: level.level,
            }))}
            selectedOption={interviewLevel?.interviewLevelId || null}
            onOptionSelect={(level) => dispatch(setInterviewLevel(level))}
            handleNext={handleNext}
            handleBack={handleBack}
          />
        );
    

      case 3:
        const clientTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        return (
          <StepContent
            title={`Select Interview Time \n (Below Times in ${clientTimezone})`}
            options={interviewTimes
              .filter(
                (time) => time.interviewTypeId === interviewType?.interviewTypeId
              )[0]
              ?.times.map((slot) => ({
                id: slot.slotId,
                label: slot.time,
              }))}
            selectedOption={interviewTime?.slotId || null}
            onOptionSelect={(time) => dispatch(setInterviewTime(time))}
            handleNext={handleNext}
            handleBack={handleBack}
          />
        );
      case 4:
        return (
          <div>
            <h3 className="text-lg font-semibold mb-4">Confirm and Schedule</h3>
            <div className="flex flex-col space-y-4">
              <button
                onClick={handleSchedule}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                aria-label="Schedule Interview"
              >
                Schedule
              </button>
              <button
                onClick={handleBack}
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300"
                aria-label="Go Back"
              >
                Back
              </button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const isSmallHeight = step === 1 || step === 2 || step === 4;
  const modalHeightClass = isSmallHeight ? 'max-h-[40vh]' : 'max-h-[80vh]';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div
        className={`bg-white border border-gray-300 rounded-lg shadow-lg w-full max-w-lg ${modalHeightClass} p-6 relative overflow-hidden flex flex-col h-full`}
      >
        <div className="flex-1 overflow-y-auto">
          {renderStepContent()}
          {status === "loading" && (
            <p className="text-blue-500 mt-4">Scheduling...</p>
          )}
          {status === "error" && (
            <p className="text-red-500 mt-4">Error: {error}</p>
          )}
          {status === "success" && (
            <p className="text-green-500 mt-4">
              Interview Scheduled Successfully!
            </p>
          )}
        </div>
        <button
          onClick={closeModal}
          className="absolute top-4 right-4 text-gray-700 font-medium hover:text-gray-900"
          aria-label="Close Modal"
        >
          ✕
        </button>
      </div>
    </div>
  );
};

export default InterviewModal;