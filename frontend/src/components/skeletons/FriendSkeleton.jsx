const FriendSkeleton = () => {
  return (
    <div className="space-y-4 p-4">
      {[1, 2, 3, 4].map((item) => (
        <div
          key={item}
          className="flex items-center gap-3 p-2 rounded-lg bg-base-100"
        >
          <div className="skeleton w-12 h-12 rounded-full" />
          <div className="flex-1 space-y-2">
            <div className="skeleton h-4 w-24 rounded" />
            <div className="skeleton h-3 w-32 rounded" />
          </div>
        </div>
      ))}
    </div>
  )
}

export default FriendSkeleton;
