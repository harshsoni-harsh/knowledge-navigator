import { PageLayout } from '@/components/page-layout';
import Image from 'next/image';
import Link from 'next/link';

export default function NotFound() {
  return (
    <PageLayout title="">
      <div className="flex flex-col items-center justify-center grow p-4">
        <div className="border-2 p-8 rounded-lg shadow-md text-center flex flex-col items-center max-w-md">
          <Image
            src="/404-illustration.svg"
            alt="404 Illustration"
            className="w-32 h-32 mb-6 grayscale"
            width={100}
            height={100}
          />
          <h2 className="text-2xl font-bold text-red-500 mb-4">
            404 - Page Not Found
          </h2>
          <p className="text-gray-500 mb-6">
            Oops! The page you&apos;re looking for doesn&apos;t exist. It might
            have been moved or deleted.
          </p>
          <Link
            href="/"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
          >
            Go Back Home
          </Link>
        </div>
      </div>
    </PageLayout>
  );
}
