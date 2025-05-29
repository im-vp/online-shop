'use client';

import { MainError } from '@/components/pages/Error/MainError';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return <MainError />;
}
