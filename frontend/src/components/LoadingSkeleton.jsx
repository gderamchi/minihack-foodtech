import React from 'react';

/**
 * LoadingSkeleton Component
 * Displays animated skeleton loaders while content is loading
 * Provides better UX than blank screens or spinners
 */
function LoadingSkeleton({ type = 'card', count = 1 }) {
  const skeletons = Array.from({ length: count }, (_, i) => i);

  // Card skeleton (for profile sections, quick actions)
  if (type === 'card') {
    return (
      <>
        {skeletons.map((i) => (
          <div
            key={i}
            className="bg-white rounded-xl shadow-lg p-6 animate-pulse"
          >
            <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              <div className="h-4 bg-gray-200 rounded w-4/6"></div>
            </div>
          </div>
        ))}
      </>
    );
  }

  // Text skeleton (for paragraphs)
  if (type === 'text') {
    return (
      <div className="animate-pulse space-y-2">
        {skeletons.map((i) => (
          <div key={i} className="h-4 bg-gray-200 rounded w-full"></div>
        ))}
      </div>
    );
  }

  // Header skeleton (for page headers)
  if (type === 'header') {
    return (
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/2 mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
      </div>
    );
  }

  // Stats skeleton (for stat cards)
  if (type === 'stats') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
        {skeletons.map((i) => (
          <div key={i} className="bg-white rounded-xl shadow-lg p-6">
            <div className="h-12 w-12 bg-gray-200 rounded-full mb-4"></div>
            <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        ))}
      </div>
    );
  }

  // Badge skeleton (for achievement badges)
  if (type === 'badge') {
    return (
      <div className="grid grid-cols-4 gap-4 animate-pulse">
        {skeletons.map((i) => (
          <div key={i} className="flex flex-col items-center">
            <div className="w-16 h-16 bg-gray-200 rounded-full mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-12"></div>
          </div>
        ))}
      </div>
    );
  }

  // Section skeleton (for collapsible sections)
  if (type === 'section') {
    return (
      <>
        {skeletons.map((i) => (
          <div
            key={i}
            className="bg-white rounded-xl shadow-lg overflow-hidden animate-pulse"
          >
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-gray-200 rounded"></div>
                  <div className="h-6 bg-gray-200 rounded w-32"></div>
                </div>
                <div className="w-6 h-6 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        ))}
      </>
    );
  }

  // Default skeleton
  return (
    <div className="animate-pulse">
      <div className="h-4 bg-gray-200 rounded w-full"></div>
    </div>
  );
}

export default LoadingSkeleton;
