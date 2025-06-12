import React from 'react';
import { useFriendStore } from '../store/useFriendStore';
import { UserPlus } from 'lucide-react';

const FriendRequestButton = ({ userId }) => {
  const { sendFriendRequest } = useFriendStore();

  const handleSendRequest = async () => {
    try {
      await sendFriendRequest(userId);
    } catch (error) {
      // Error is already handled in the store
    }
  };

  return (
    <button
      onClick={handleSendRequest}
      className="btn btn-sm btn-ghost gap-2"
    >
      <UserPlus className="size-4" />
      <span>Add Friend</span>
    </button>
  );
};

export default FriendRequestButton; 