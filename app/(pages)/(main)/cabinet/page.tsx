import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

const Page = () => {
  redirect('/cabinet/profile-information');
};

export default Page;
