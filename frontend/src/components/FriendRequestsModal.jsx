import React, { useEffect } from 'react';
import { useFriendStore } from '../store/useFriendStore';
import { X } from 'lucide-react';

const FriendRequestsModal = ({ isOpen, onClose }) => {
  const { friendRequests, getFriendRequests, handleFriendRequest, isFriendRequestsLoading } = useFriendStore();

  useEffect(() => {
    if (isOpen) {
      getFriendRequests();
    }
  }, [isOpen, getFriendRequests]);

  const handleRequest = async (requestId, action) => {
    try {
      await handleFriendRequest(requestId, action);
      // Close the modal after successful action
      onClose();
    } catch (error) {
      // Error is already handled in the store
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-base-100 rounded-lg p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Friend Requests</h2>
          <button onClick={onClose} className="btn btn-ghost btn-sm">
            <X className="size-5" />
          </button>
        </div>

        {isFriendRequestsLoading ? (
          <div className="flex justify-center py-4">
            <span className="loading loading-spinner loading-md"></span>
          </div>
        ) : friendRequests.length === 0 ? (
          <p className="text-center text-base-content/70 py-4">No friend requests</p>
        ) : (
          <div className="space-y-4">
            {friendRequests.map((request) => (
              <div key={request._id} className="flex items-center justify-between p-3 bg-base-200 rounded-lg">
                <div className="flex items-center gap-3">
                  <img
                    src={request.senderId?.profilePicture || '/avatar.png'}
                    alt={request.senderId?.fullName || 'User'}
                    className="size-10 rounded-full object-contain"
                  />
                  <div>
                    <p className="font-medium">{request.senderId?.fullName || 'Unknown User'}</p>
                    <p className="text-sm text-base-content/70">{request.senderId?.email || 'No email available'}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleRequest(request._id, 'accept')}
                    className="btn btn-primary btn-sm"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => handleRequest(request._id, 'reject')}
                    className="btn btn-ghost btn-sm"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FriendRequestsModal; 