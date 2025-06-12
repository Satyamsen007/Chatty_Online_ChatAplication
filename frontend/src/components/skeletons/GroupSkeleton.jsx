import React from 'react';

const GroupSkeleton = () => {
  return (
    <div className="space-y-4 p-4">
      {[1, 2, 3, 4].map((item) => (
        <div key={item} className="flex items-center gap-3 p-2 rounded-lg">
          <div className="w-12 h-12 rounded-full bg-base-300 animate-pulse" />
          <div className="flex-1">
            <div className="h-4 w-24 bg-base-300 rounded animate-pulse mb-2" />
            <div className="h-3 w-32 bg-base-300 rounded animate-pulse" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default GroupSkeleton; 