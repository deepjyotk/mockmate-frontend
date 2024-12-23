'use client';
import React, { useState } from 'react';
import InterviewModal from './ScheduleInterviewModal/InterviewModal';
import { InitDataInterviewPayloadModel } from '@/models/interview/init/InterviewPayloadModel';
import { resetScheduleState } from '@/redux/slices/schedule-interview-modal/scheduleSlice';
import { useAppDispatch } from '@/redux/hooks';
import { motion } from 'framer-motion';
import { FiArrowRight } from 'react-icons/fi'; // Optional: For a button icon

interface HeroSectionProps {
  data: InitDataInterviewPayloadModel;
}

const HeroSection: React.FC<HeroSectionProps> = ({ data }) => {
  const [step, setStep] = useState(1);
  const [isModalOpen, setModalOpen] = useState(false);
  const dispatch = useAppDispatch();

  const openModal = () => setModalOpen(true);
  const closeModal = () => {
    setModalOpen(false);
    dispatch(resetScheduleState());
    setStep(1);
  };

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      setModalOpen(false);
    }
  };

  return (
    <motion.section
      className="relative bg-gradient-to-r from-blue-500 to-indigo-600 py-20"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      {/* Animated Background Elements (Optional) */}
      <div className="absolute top-0 left-0 w-32 h-32 bg-pink-300 rounded-full opacity-50 animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-24 h-24 bg-yellow-300 rounded-full opacity-50 animate-pulse"></div>

      <div className="max-w-4xl mx-auto text-center text-white">
        <motion.h2
          className="text-5xl font-extrabold mb-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          Practice Mock Interviews with Peers
        </motion.h2>
        <motion.p
          className="text-lg mb-8"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          Join thousands of tech candidates practicing interviews to land jobs. Engage in real questions over video chat in a collaborative environment and receive valuable feedback.
        </motion.p>
        <motion.button
          onClick={openModal}
          className="bg-white text-blue-600 px-6 py-3 rounded-full shadow-lg flex items-center justify-center hover:bg-gray-100 transition"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Schedule Practice Session <FiArrowRight className="ml-2" />
        </motion.button>
      </div>
      {isModalOpen && (
        <InterviewModal
          step={step}
          closeModal={closeModal}
          handleNext={handleNext}
          handleBack={handleBack}
          data={data}
        />
      )}
    </motion.section>
  );
};

export default HeroSection;
