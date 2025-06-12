import React, { useEffect } from 'react'
import { useChatStore } from '../store/useChatStore';
import { useGroupChatStore } from '../store/useGroupChatStore';
import Sidebar from '../components/Sidebar';
import NoChatSelected from '../components/NoChatSelected';
import ChatContainer from '../components/ChatContainer';
import GroupChatContainer from '../components/GroupChatContainer';
import { Helmet } from 'react-helmet';

const HomePage = () => {
  const { selectedUser, setSelectedUser } = useChatStore();
  const { selectedGroup, setSelectedGroup } = useGroupChatStore();

  // Cleanup function to handle chat switching
  useEffect(() => {
    if (selectedGroup) {
      setSelectedUser(null); // Clear user chat when group is selected
    }
  }, [selectedGroup, setSelectedUser]);

  useEffect(() => {
    if (selectedUser) {
      setSelectedGroup(null);
    }
  }, [selectedUser, setSelectedGroup]);

  const renderChatContent = () => {
    if (selectedGroup) {
      return <GroupChatContainer />;
    }
    if (selectedUser) {
      return <ChatContainer />;
    }
    return <NoChatSelected />;
  };

  return (
    <>
      <Helmet>
        <title>Chatty – Instant & Secure Online Chat App</title>
        <meta
          name="description"
          content="Chatty is a fast, secure, and user-friendly online chat application built with Vite + React. Connect, chat, and share instantly with your friends or teams in real-time."
        />
      </Helmet>
      <div className='h-screen bg-base-300'>
        <div className='flex items-center justify-center pt-20 px-4'>
          <div className='bg-base-100 rounded-lg shadow-cl w-full max-w-[90%] h-[calc(100vh-8rem)]'>
            <div className='flex h-full rounded-lg overflow-hidden'>
              <Sidebar />
              {renderChatContent()}
            </div>
          </div>
        </div>
      </div>
    </>

  )
}

export default HomePage;