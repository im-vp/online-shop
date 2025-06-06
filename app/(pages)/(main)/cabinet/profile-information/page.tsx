import { redirect } from 'next/navigation';

import UserProfile from '@/components/pages/Cabinet/Profile';

import { getUserProfile } from '@/services/server-action/actions';

const Page = async () => {
  const { data: profile } = await getUserProfile();

  if (!profile) redirect('/authentication');

  return <UserProfile profile={profile} />;
};

export default Page;
