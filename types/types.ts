import { IUser } from '@/types/user-types';

export interface ICategories {
  _id: string;
  name: string;
  slug: string;
  display: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
export interface ICategoriesResponse {
  categories: ICategories[];
  categoriesQuantity: number;
}
export interface IProduct {
  _id: string;
  category: ICategories;
  name: string;
  slug: string;
  path: string;
  product_code: string;
  images: string[];
  description?: string;
  price: number;
  rating: IRating;
  reviews?: number;
  createdAt?: Date;
  updatedAt?: Date;
}
export interface IApiResponse<T = null> {
  success: boolean;
  message: string;
  data: T;
}

export interface IProductResponse {
  products: IProduct[];
  productsQuantity: number;
  category: ICategories;
}

export interface ICartProduct extends IProduct {
  quantity: number;
  totalPrice: number;
}
export interface ICart {
  products: ICartProduct[];
  totalSum: number;
  totalQuantity: number;
}

export interface IRating {
  value: number;
  reviewCount: number;
}

export interface IReviews {
  _id: string;
  user: IUser;
  reviewText: string;
  rating: number;
  product: IProduct;
  date: Date;
}

export interface ICookies {
  name: string;
  value: string;
  params:
    | {
        [key: string]: any;
      }
    | {};
}

export interface IReviewBody {
  firstName: string;
  lastName: string;
  reviewText: string;
  rating: number;
  date: Date;
}

export enum SortType {
  rating = 'rating',
  cheap = 'cheap',
  expensive = 'expensive',
}

export interface IFilterParams {
  sort?: string;
  range?: {
    min: number;
    max: number;
  };
  filters?: {
    [key: string]: string;
  };
}

export type RemoveFiltersType = 'all' | 'one';

export interface CheckoutFormValues {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
}

export interface CartCookieValues {
  id: string;
  quantity: number;
}

type CartAction = 'add' | 'open' | 'quantity' | 'remove';

export interface CartRequestBody {
  action: CartAction;
  productId: string;
  value?: number;
}

export interface IOrderProduct {
  product: IProduct;
  quantity: number;
}

export interface IOrder {
  _id: string;
  userId?: IUser; // для зарегистрированных пользователей
  guestName?: string; // для гостей
  guestEmail?: string; // для гостей
  products: IOrderProduct[];
  status: 'pending' | 'confirmed' | 'shipped' | 'cancelled' | 'completed';
  orderNumber: string;
  totalPrice: number;
  deliveryAddress: string;
  phoneNumber: string;
  createdAt: Date;
  updatedAt: Date;
}

export type OrderCreateApi = Omit<
  IOrder,
  'status' | 'orderNumber' | 'createdAt' | 'updatedAt' | 'userId' | '_id' | 'products'
> & { userId?: string } & {
  products: {
    product: string;
    quantity: number;
  }[];
};
