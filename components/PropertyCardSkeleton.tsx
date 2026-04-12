export default function PropertyCardSkeleton() {
  return (
    <div className="bg-white rounded-sm overflow-hidden border border-gray-100">
      <div className="shimmer aspect-[4/3]" />
      <div className="p-5 space-y-3">
        <div className="shimmer h-7 w-32 rounded-sm" />
        <div className="shimmer h-5 w-full rounded-sm" />
        <div className="shimmer h-4 w-3/4 rounded-sm" />
        <div className="shimmer h-4 w-1/2 rounded-sm" />
        <div className="flex gap-4 pt-3 border-t border-gray-50">
          <div className="shimmer h-4 w-16 rounded-sm" />
          <div className="shimmer h-4 w-16 rounded-sm" />
          <div className="shimmer h-4 w-20 rounded-sm ml-auto" />
        </div>
        <div className="shimmer h-10 w-full rounded-sm" />
      </div>
    </div>
  );
}
