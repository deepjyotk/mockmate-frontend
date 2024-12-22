'use client';
// pages/index.tsx
import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import { motion } from 'framer-motion'
import FeatureCard from '@/components/test_landing/FeatureCard'


const Home: NextPage = () => {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col items-center justify-center px-4">
      <Head>
        <title>Peer2Peer Mock Interviews</title>
        <meta name="description" content="Practice mock interviews with peers to enhance your skills." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <motion.div
        className="text-center p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-2xl w-full"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <motion.h1
          className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-gray-800 dark:text-white"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          Welcome to Peer2Peer Mock Interviews
        </motion.h1>
        <motion.p
          className="text-lg md:text-xl mb-6 text-gray-700 dark:text-gray-300"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
        >
          Enhance your interview skills by practicing with peers. Get feedback, build confidence, and increase your chances of success.
        </motion.p>
        <motion.a
          href="#get-started"
          className="inline-block px-6 py-3 bg-blue-600 text-white rounded-md shadow hover:bg-blue-700 transition"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Get Started
        </motion.a>
      </motion.div>

      <motion.div
        className="mt-10"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
      >
        <Image src="/hero.svg" alt="Hero Image" width={500} height={300} />
      </motion.div>

      {/* Additional Sections */}
      <motion.section
        id="features"
        className="mt-20 max-w-4xl w-full"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
      >
        <h2 className="text-3xl font-semibold text-center mb-8 text-gray-800 dark:text-white">
          Features
        </h2>
        <div className="flex flex-wrap gap-8 justify-center">
          <FeatureCard
            title="Realistic Scenarios"
            description="Practice with real interview questions tailored to your field."
            icon="/icons/scenario.svg"
          />
          <FeatureCard
            title="Peer Feedback"
            description="Receive constructive feedback from your peers to improve."
            icon="/icons/feedback.svg"
          />
          <FeatureCard
            title="Flexible Scheduling"
            description="Schedule mock interviews at times that suit you."
            icon="/icons/schedule.svg"
          />
        </div>
      </motion.section>

      {/* Call to Action */}
      <motion.div
        id="get-started"
        className="mt-20 text-center"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
      >
        <a
          href="/signup"
          className="px-8 py-4 bg-green-600 text-white rounded-md shadow-lg hover:bg-green-700 transition text-lg"
        >
          Sign Up Now
        </a>
      </motion.div>
    </div>
  )
}



export default Home ;
