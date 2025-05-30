import { redirect } from 'next/navigation';

import UserProfile from '@/components/pages/Cabinet/Profile';

import { getUserProfile } from '@/services/server-action/actions';

export const dynamic = 'force-dynamic';

const Page = async () => {
  const profile = await getUserProfile();

  if (!profile) redirect('/authentication');

  return <UserProfile profile={profile} />;
};

export default Page;
