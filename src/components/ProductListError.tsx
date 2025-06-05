'use client';

export function ProductListError() {
  return (
    <div className="text-center py-12">
      <h2 className="text-2xl font-bold text-red-600 mb-4">
        Something went wrong
      </h2>
      <p className="text-gray-600 mb-6">
        We&apos;re having trouble loading the products. Please try again later.
      </p>
      <button
        onClick={() => window.location.reload()}
        className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition-colors"
      >
        Retry
      </button>
    </div>
  );
} 