// pages/index.tsx
import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import { motion } from 'framer-motion'

type FeatureProps = {
    title: string
    description: string
    icon: string
  }
  
  const FeatureCard: React.FC<FeatureProps> = ({ title, description, icon }) => {
    return (
      <motion.div
        className="flex flex-col items-center p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md w-80"
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.3 }}
      >
        <Image src={icon} alt={`${title} Icon`} width={64} height={64} />
        <h3 className="mt-4 text-2xl font-semibold text-gray-800 dark:text-white">{title}</h3>
        <p className="mt-2 text-gray-600 dark:text-gray-300 text-center">{description}</p>
      </motion.div>
    )
  }

  export default FeatureCard ;