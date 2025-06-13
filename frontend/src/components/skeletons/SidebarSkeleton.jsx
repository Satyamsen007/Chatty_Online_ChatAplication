import { Users } from 'lucide-react';
import React from 'react';

const SidebarSkeleton = () => {
  const skeletonContacts = Array(8).fill(null);

  return (
    <aside
      className="h-full w-20 lg:w-[340px] border-r border-base-300 
      flex flex-col transition-all duration-200 max-md:hidden "
    >

      {/* Skeleton Contacts */}
      <div className="overflow-y-auto w-full py-3 flex flex-col gap-4">
        {skeletonContacts.map((_, idx) => (
          <div
            key={idx}
            className="w-full p-3 flex items-center gap-3 hover:bg-base-200 bg-base-100 transition-colors"
          >
            {/* Avatar skeleton */}
            <div className="relative mx-auto lg:mx-0">
              <div className="skeleton size-12 rounded-full bg-base-300" />
            </div>

            {/* User info skeleton */}
            <div className="hidden lg:block text-left min-w-0 flex-1 space-y-1">
              <div className="skeleton h-4 w-32 rounded bg-base-300" />
              <div className="skeleton h-3 w-16 rounded bg-base-300" />
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
};

export default SidebarSkeleton;
