import { useChatStore } from '../store/useChatStore';
import { useGroupChatStore } from '../store/useGroupChatStore';
import { useAuthStore } from '../store/useAuthStore';
import { X, Users } from 'lucide-react';
import { useState } from 'react';
import GroupDetailsModal from './GroupDetailsModal';

const ChatHeader = ({ isGroup, image, members }) => {
  const { selectedUser, setSelectedUser } = useChatStore();
  const { selectedGroup, setSelectedGroup } = useGroupChatStore();
  const { onlineUsers } = useAuthStore();
  const [isGroupDetailsOpen, setIsGroupDetailsOpen] = useState(false);

  const handleClose = () => {
    if (isGroup) {
      setSelectedGroup(null);
    } else {
      setSelectedUser(null);
    }
  };

  const handleGroupInfoClick = () => {
    if (isGroup) {
      setIsGroupDetailsOpen(true);
    }
  };

  return (
    <>
      <div className="p-2.5 border-b border-base-300">
        <div className="flex items-center justify-between">
          <div
            className={`flex items-center gap-3 ${isGroup ? 'cursor-pointer hover:bg-base-200 p-2 rounded-lg transition-colors' : ''}`}
            onClick={handleGroupInfoClick}
          >
            {/* Avatar */}
            <div className="avatar">
              <div className="size-10 rounded-full relative">
                <img
                  src={isGroup ? (image || "/avatar.png") : (selectedUser.profilePicture || "/avatar.png")}
                  alt={isGroup ? "Group" : selectedUser.fullName}
                />
              </div>
            </div>

            {/* User/Group info */}
            <div>
              <h3 className="font-medium">{isGroup ? selectedGroup?.name : selectedUser.fullName}</h3>
              <div className="text-base-content/70 flex items-center gap-1">
                {isGroup ? (
                  <>
                    <Users className="size-4" />
                    <p className='text-sm'>{members?.length || 0} members</p>
                  </>
                ) : (
                  <>
                    <span className={`w-2 mt-1 h-2 rounded-full ${onlineUsers.includes(selectedUser._id) ? 'bg-primary' : 'bg-base-content/30'}`}></span>
                    <p className='text-sm'>{onlineUsers.includes(selectedUser._id) ? "online" : "offline"}</p>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Close button */}
          <button className='cursor-pointer' onClick={handleClose}>
            <X />
          </button>
        </div>
      </div>

      {/* Group Details Modal */}
      {isGroup && (
        <GroupDetailsModal
          isOpen={isGroupDetailsOpen}
          onClose={() => setIsGroupDetailsOpen(false)}
          group={selectedGroup}
        />
      )}
    </>
  );
}

export default ChatHeader;