import UserProfile from '@/components/pages/Cabinet/Profile';

import { getUserProfile } from '@/services/server-action/actions';

const Page = async () => {
  const data = await getUserProfile();

  const parseUserProfile = data ? JSON.parse(JSON.stringify(data)) : [];
  console.log(parseUserProfile);

  return (
    <>
      {parseUserProfile ? (
        <UserProfile profile={parseUserProfile} />
      ) : (
        <h2 className="cabinet-page__title">Данные профиля отсутствуют</h2>
      )}
    </>
  );
};

export default Page;
