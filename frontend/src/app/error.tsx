'use client';

import { PageLayout } from '@/components/page-layout';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <PageLayout title="">
      <div className="flex flex-col items-center justify-center grow p-4">
        <div className="p-8 rounded-lg shadow-md text-center max-w-md">
          <p className="text-gray-400 mb-6">
            {error.message || 'An unexpected error occurred. Please try again.'}
          </p>
          <button
            onClick={() => reset()}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    </PageLayout>
  );
}
