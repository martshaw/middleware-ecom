export function ProductListSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {[...Array(8)].map((_, index) => (
        <div key={index} className="border rounded-lg p-4 shadow-sm animate-pulse">
          <div className="bg-gray-200 h-48 rounded-md mb-4" />
          <div className="bg-gray-200 h-6 w-3/4 mb-2" />
          <div className="flex justify-between items-center">
            <div className="bg-gray-200 h-6 w-1/4" />
            <div className="bg-gray-200 h-10 w-24" />
          </div>
        </div>
      ))}
    </div>
  );
} 