import Favorites from '@/components/pages/Cabinet/Favorites';

import { getUserFavoritesProducts } from '@/services/server-action/favorites';

export const dynamic = 'force-dynamic';

const FavoritesPage = async () => {
  const favoritesProducts = await getUserFavoritesProducts();

  const parseFavoritesProducts = favoritesProducts
    ? JSON.parse(JSON.stringify(favoritesProducts))
    : [];

  return <Favorites favoritesProducts={parseFavoritesProducts} />;
};

export default FavoritesPage;
