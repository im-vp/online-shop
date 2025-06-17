import debounce from 'lodash.debounce';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

import { getCartTotalPrice, getCartTotalQuantity } from '@/lib/utils/utils';

import { CartApi } from '@/services/api/cart';
import { CartRequestBody, IApiResponse, ICartProduct, ICartResponse } from '@/types/types';

interface CartProperties {
  products: ICartProduct[];
  totalQuantity: number;
  totalSum: number;
  loadingProductIdMap: Record<string, 'loading' | 'success' | 'initial'>;
}

export interface CartState extends CartProperties {
  isProductInCart: (id: string) => boolean;
  openCart: () => void;
  addToCart: (_id: string) => void;
  removeFromCart: (id: string) => void;
  plusOne: (id: string) => void;
  minusOne: (id: string) => void;
  setTotalQuantity: (quantity: number) => void;
  cleanCart: () => void;
  calculateTotal: () => void;
  fetchGetCartData: ({
    action,
    productId,
    value,
  }: CartRequestBody) => Promise<IApiResponse<ICartResponse | null>>;
}

const initialState: CartProperties = {
  products: [],
  totalQuantity: 0,
  totalSum: 0,
  loadingProductIdMap: {},
};

export const createCartStore = (initProps: Partial<CartProperties>) =>
  create<CartState>()(
    devtools((set, get) => ({
      ...initialState,
      ...initProps,
      fetchGetCartData: debounce(async ({ action, productId, value }) => {
        set((state) => ({
          loadingProductIdMap: { ...state.loadingProductIdMap, [productId]: 'loading' },
        }));

        const { success, data } = await CartApi.getCart({
          action,
          productId: !productId || productId === 'cart' ? null : productId,
          value,
        });

        let returnData = null;
        if (success && data?.products.length) {
          set({
            products: data.products,
            totalQuantity: data.totalQuantity,
            totalSum: data.totalSum,
            loadingProductIdMap: { ...get().loadingProductIdMap, [productId]: 'success' },
          });

          returnData = {
            products: data.products,
            totalQuantity: data.totalQuantity,
            totalSum: data.totalSum,
          };
        } else {
          set({
            loadingProductIdMap: { ...get().loadingProductIdMap, [productId]: 'success' },
          });
        }

        setTimeout(() => {
          set((state) => {
            const newLoadingMap = {
              ...state.loadingProductIdMap,
            };

            delete newLoadingMap[productId];

            return {
              ...state,
              loadingProductIdMap: newLoadingMap,
            };
          });
        }, 100);

        return returnData;
      }, 500) as unknown as CartState['fetchGetCartData'],

      isProductInCart: (id) => {
        return get().products.some((product) => product._id === id);
      },
      setTotalQuantity: (quantity) => {
        set({
          totalQuantity: quantity,
        });
      },
      calculateTotal: () =>
        set((state) => {
          const totalSum = getCartTotalPrice(state.products);
          const totalQuantity = getCartTotalQuantity(state.products);

          return {
            totalSum,
            totalQuantity,
          };
        }),
      plusOne: (id) => {
        set((state) => {
          const updatedProducts = state.products.map((product) => {
            if (product._id === id) {
              return {
                ...product,
                quantity: product.quantity + 1,
                totalPrice: product.totalPrice + product.price,
              };
            }
            return product;
          });

          return {
            products: updatedProducts,
          };
        });
        get().calculateTotal();
        get().fetchGetCartData({
          action: 'quantity',
          productId: id,
          value: get().products.find((product) => product._id === id)?.quantity,
        });
      },
      minusOne: (id) => {
        set((state) => {
          const updatedProducts = state.products.map((product) => {
            if (product._id === id) {
              return {
                ...product,
                quantity: product.quantity - 1,
                totalPrice: product.totalPrice - product.price,
              };
            }
            return product;
          });

          return {
            products: updatedProducts,
          };
        });
        get().calculateTotal();
        get().fetchGetCartData({
          action: 'quantity',
          productId: id,
          value: get().products.find((product) => product._id === id)?.quantity,
        });
      },
      addToCart: (_id) => get().fetchGetCartData({ action: 'add', productId: _id }),
      cleanCart: () => {
        set({
          products: [],
          totalQuantity: 0,
          totalSum: 0,
        });
      },
      openCart: () =>
        get().fetchGetCartData({
          action: 'open',
          productId: 'cart',
        }),
      removeFromCart: (id) => {
        const inCart = get().isProductInCart(id);

        if (!inCart) return;

        const products = get().products.filter((product) => product._id !== id);

        set({ products });

        get().calculateTotal();
        get().fetchGetCartData({
          action: 'remove',
          productId: id,
        });
      },
    })),
  );
