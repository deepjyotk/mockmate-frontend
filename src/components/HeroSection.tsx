'use client';
import React, { useState } from 'react';
import InterviewModal from './ScheduleInterviewModal/InterviewModal';
import { InitDataInterviewPayloadModel } from '@/models/interview/init/InterviewPayloadModel';
import { resetScheduleState } from '@/redux/slices/schedule-interview-modal/scheduleSlice';
import { useAppDispatch } from '@/redux/hooks';

interface HeroSectionProps {
  data: InitDataInterviewPayloadModel; // Accept the data prop
}
const HeroSection: React.FC<HeroSectionProps> = ({ data }) => {
  const [step, setStep] = useState(1);
  const [isModalOpen, setModalOpen] = useState(false);
  const dispatch = useAppDispatch();

  const openModal = () => setModalOpen(true);
  const closeModal = () => {
    setModalOpen(false);
    dispatch(resetScheduleState());
    setStep(1); // Reset to first step when modal is closed
  };

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }else{
      setModalOpen(false);
    }
  };

  return (
    <section className="bg-background py-12">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-4xl font-bold text-foreground mb-4">
          Practice mock interviews with peers
        </h2>
        <p className="text-muted mb-6">
          Join thousands of tech candidates practicing interviews to land jobs. Practice real questions over video chat in a collaborative environment and get helpful feedback.
        </p>
        <button
          onClick={openModal}
          className="bg-primary text-white px-6 py-3 rounded-lg shadow hover:bg-blue-600"
        >
          Schedule practice session
        </button>
      </div>
      {isModalOpen && (
        <InterviewModal
          step={step}
          closeModal={closeModal}
          handleNext={handleNext}
          handleBack={handleBack}
          data={data} // Pass data to the modal

        />
      )}
    </section>
  );
};

export default HeroSection;