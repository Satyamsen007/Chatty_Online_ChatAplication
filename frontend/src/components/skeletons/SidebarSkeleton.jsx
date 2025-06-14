import { Users } from 'lucide-react';
import React from 'react';

const SidebarSkeleton = () => {
  const skeletonContacts = Array(8).fill(null);

  return (
    <aside
      className="h-full w-full max-w-[340px] border-r border-base-300 
      flex flex-col transition-all duration-200"
    >

      {/* Skeleton Contacts */}
      <div className="overflow-y-auto w-full py-3 px-2 md:px-4 flex flex-col gap-3">
        {skeletonContacts.map((_, idx) => (
          <div
            key={idx}
            className="w-full p-2 md:p-3 flex flex-col md:flex-row items-center gap-2 md:gap-3 hover:bg-base-200 bg-base-100 transition-colors rounded-lg"
          >
            {/* Avatar skeleton */}
            <div className="relative mx-auto md:mx-0">
              <div className="skeleton size-10 md:size-12 rounded-full bg-base-300" />
            </div>

            {/* User info skeleton */}
            <div className="text-left min-w-0 flex-1 space-y-1">
              <div className="skeleton h-3 md:h-4 w-24 md:w-32 rounded bg-base-300" />
              <div className="skeleton h-2 md:h-3 w-12 md:w-16 rounded bg-base-300" />
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
};

export default SidebarSkeleton;
