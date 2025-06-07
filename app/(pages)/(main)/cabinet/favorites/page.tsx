import Favorites from '@/components/pages/Cabinet/Favorites';

import { getUserFavoritesProducts } from '@/services/server-action/favorites';

const FavoritesPage = async () => {
  const { success, data } = await getUserFavoritesProducts();

  if (!success || !data) return null;

  return <Favorites favoritesProducts={data} />;
};

export default FavoritesPage;
