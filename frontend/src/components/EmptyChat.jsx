import React from 'react';
import { motion } from 'framer-motion';

const EmptyChat = ({ type = 'single' }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full p-4 text-center">
      <motion.div
        className="w-24 h-24 mb-4 text-base-content/40"
        initial={{ scale: 0, opacity: 0 }}
        animate={{
          scale: 1,
          opacity: 1,
          y: [0, -10, 0]
        }}
        transition={{
          scale: {
            type: "spring",
            stiffness: 260,
            damping: 20,
            delay: 0.1
          },
          opacity: {
            duration: 0.5,
            delay: 0.1
          },
          y: {
            duration: 2,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut"
          }
        }}
      >
        {type === 'single' ? (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="stroke-primary">
            <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="stroke-primary">
            <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
          </svg>
        )}
      </motion.div>
      <motion.h3
        className="text-xl font-semibold text-base-content mb-2"
        initial={{ y: 20, opacity: 0 }}
        animate={{
          y: 0,
          opacity: 1,
          scale: [1, 1.02, 1]
        }}
        transition={{
          y: {
            type: "spring",
            stiffness: 260,
            damping: 20,
            delay: 0.2
          },
          opacity: {
            duration: 0.5,
            delay: 0.2
          },
          scale: {
            duration: 2,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut"
          }
        }}
      >
        {type === 'single' ? 'No Messages Yet' : 'No Group Messages Yet'}
      </motion.h3>
      <motion.p
        className="text-base-content/70 max-w-sm"
        initial={{ y: 20, opacity: 0 }}
        animate={{
          y: 0,
          opacity: 1,
          scale: [1, 1.01, 1]
        }}
        transition={{
          y: {
            type: "spring",
            stiffness: 260,
            damping: 20,
            delay: 0.3
          },
          opacity: {
            duration: 0.5,
            delay: 0.3
          },
          scale: {
            duration: 2,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
            delay: 0.5
          }
        }}
      >
        {type === 'single'
          ? 'Start a conversation by sending your first message!'
          : 'Be the first one to start the conversation in this group!'}
      </motion.p>
    </div>
  );
};

export default EmptyChat; 