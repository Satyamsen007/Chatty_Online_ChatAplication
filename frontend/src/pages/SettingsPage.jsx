import React from 'react'
import { useThemeStore } from '../store/useThemeStore';
import { THEMES } from '../constants';
import { Send } from 'lucide-react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';

const PREVIEW_MESSAGES = [
  { id: 1, content: "Hello, how are you?", isSender: false },
  {
    id: 2,
    content: "I'm fine, thank you!",
    isSender: true,
  },
]

const SettingsPage = () => {
  const { setTheme } = useThemeStore();
  return (
    <>
      <Helmet>
        <title>Customize Your Chatty Experience – Themes & Colors</title>
        <meta
          name="description"
          content="Make Chatty truly yours! Choose light or dark mode, pick vibrant colors, and personalize your chat app to match your style."
        />
      </Helmet>
      <motion.div
        className='h-screen container mx-auto px-4 py-20 max-w-5xl'
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className='space-y-6'
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <motion.div
            className='flex flex-col gap-1'
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <h2 className='text-lg font-semibold'>Theme</h2>
            <p className='text-sm text-base-content/70'>Choose a theme for your chat interface</p>
          </motion.div>
          <motion.div
            className='grid grid-cols-3 sm:grid-cols-6 md:grid-cols-8 gap-2'
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            {
              THEMES.map((theme) => (
                <motion.button
                  key={theme}
                  onClick={() => setTheme(theme)}
                  className={`group flex flex-col items-center gap-1.5 cursor-pointer p-2 rounded-lg transition-colors ${theme === theme ? 'bg-base-200' : 'hover:bg-base-200/50'}`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className='relative h-8 w-full rounded-md overflow-hidden' data-theme={theme}>
                    <div className='absolute inset-0 grid grid-cols-4 gap-px p-1'>
                      <div className='rounded bg-primary'></div>
                      <div className='rounded bg-secondary'></div>
                      <div className='rounded bg-accent'></div>
                      <div className='rounded bg-neutral'></div>
                    </div>
                  </div>
                  <span className='text-[11px] font-medium truncate w-full text-center'>
                    {theme.charAt(0).toUpperCase() + theme.slice(1)}
                  </span>
                </motion.button>
              ))
            }
          </motion.div>
          {/* Preview Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <h3 className="text-lg font-semibold mb-3">Preview</h3>
            <div className="rounded-xl border border-base-300 overflow-hidden bg-base-100 shadow-lg">
              <div className="p-4 bg-base-200">
                <div className="max-w-lg mx-auto">
                  {/* Mock Chat UI */}
                  <div className="bg-base-100 rounded-xl shadow-sm overflow-hidden">
                    {/* Chat Header */}
                    <div className="px-4 py-3 border-b border-base-300 bg-base-100">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-content font-medium">
                          J
                        </div>
                        <div>
                          <h3 className="font-medium text-sm">John Doe</h3>
                          <p className="text-xs text-base-content/70">Online</p>
                        </div>
                      </div>
                    </div>

                    {/* Chat Messages */}
                    <div className="p-4 space-y-4 min-h-[200px] max-h-[200px] overflow-y-auto bg-base-100">
                      {PREVIEW_MESSAGES.map((message) => (
                        <div
                          key={message.id}
                          className={`flex ${message.isSender ? "justify-end" : "justify-start"}`}
                        >
                          <div
                            className={`
                            max-w-[80%] rounded-xl p-3 shadow-sm
                            ${message.isSender ? "bg-primary text-primary-content" : "bg-base-200"}
                          `}
                          >
                            <p className="text-sm">{message.content}</p>
                            <p
                              className={`
                              text-[10px] mt-1.5
                              ${message.isSender ? "text-primary-content/70" : "text-base-content/70"}
                            `}
                            >
                              12:00 PM
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Chat Input */}
                    <div className="p-4 border-t border-base-300 bg-base-100">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          className="input input-bordered flex-1 text-sm h-10"
                          placeholder="Type a message..."
                          value="This is a preview"
                          readOnly
                        />
                        <button className="btn btn-primary h-10 min-h-0">
                          <Send size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </>

  )
}

export default SettingsPage
