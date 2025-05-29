import debounce from 'lodash.debounce';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

import { getCartTotalPrice, getCartTotalQuantity } from '@/lib/utils/utils';

import { ICartProduct } from '@/types/types';

interface CartState {
  cart: {
    products: ICartProduct[];
    totalQuantity: number;
    totalSum: number;
    isLoading: {
      status: 'loading' | 'success' | 'initial';
      productId: string;
    };
  };
  isProductInCart: (id: string) => boolean;
  openCart: () => void;
  addToCart: (_id: string) => void;
  removeFromCart: (id: string) => void;
  plusOne: (id: string) => void;
  minusOne: (id: string) => void;
  setTotalQuantity: (quantity: number) => void;
  cleanCart: () => void;
  calculateTotal: () => void;
  fetchGetCartData: (action: string, id?: string, value?: number) => Promise<void>;
}

export const useCartStore = create<CartState>()(
  devtools((set, get) => ({
    cart: {
      products: [],
      totalQuantity: 0,
      totalSum: 0,
      isLoading: {
        status: 'initial',
        productId: '',
      },
    },

    fetchGetCartData: debounce(async (action: string, id?: string, value?: number) => {
      set((state) => ({
        cart: {
          ...state.cart,
          isLoading: {
            status: 'loading',
            productId: id || '',
          },
        },
      }));

      fetch('/api/cart/action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action,
          productId: id || '',
          value,
        }),
      })
        .then((resp) => resp.json())
        .then((data) => {
          if (data?.products?.length) {
            set((state) => {
              return {
                cart: {
                  ...state.cart,
                  products: data.products,
                  totalQuantity: data.totalQuantity,
                  totalSum: data.totalSum,
                  isLoading: {
                    status: 'success',
                    productId: '',
                  },
                },
              };
            });
            return {
              products: data.products as ICartProduct[],
              totalQuantity: data.totalQuantity as number,
              totalSum: data.totalSum as number,
            };
          } else {
            set((state) => {
              return {
                cart: {
                  ...state.cart,
                  isLoading: {
                    status: 'success',
                    productId: '',
                  },
                },
              };
            });
          }
        })
        .then(() => {
          set((state) => {
            return {
              cart: {
                ...state.cart,
                isLoading: {
                  status: 'initial',
                  productId: '',
                },
              },
            };
          });
        });
    }, 500) as (action: string, id?: string, value?: number) => Promise<void>,
    isProductInCart: (id) => {
      return get().cart.products.some((product) => product._id === id);
    },
    setTotalQuantity: (quantity) => {
      set((state) => {
        return {
          cart: {
            ...state.cart,
            totalQuantity: quantity,
          },
        };
      });
    },
    calculateTotal: () =>
      set((state) => {
        const totalSum = getCartTotalPrice(state.cart.products);
        const totalQuantity = getCartTotalQuantity(state.cart.products);

        return {
          cart: {
            ...state.cart,
            totalSum,
            totalQuantity,
          },
        };
      }),
    plusOne: (id) => {
      set((state) => {
        const updatedProducts = state.cart.products.map((product) => {
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
          cart: {
            ...state.cart,
            products: updatedProducts,
          },
        };
      });
      get().calculateTotal();
      get().fetchGetCartData(
        'quantity',
        id,
        get().cart.products.find((product) => product._id === id)?.quantity,
      );
    },
    minusOne: (id) => {
      set((state) => {
        const updatedProducts = state.cart.products.map((product) => {
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
          cart: {
            ...state.cart,
            products: updatedProducts,
          },
        };
      });
      get().calculateTotal();
      get().fetchGetCartData(
        'quantity',
        id,
        get().cart.products.find((product) => product._id === id)?.quantity,
      );
    },
    addToCart: (_id) => get().fetchGetCartData('add', _id),
    cleanCart: () => {
      set((state) => ({
        cart: {
          ...state.cart,
          products: [],
          totalQuantity: 0,
          totalSum: 0,
        },
      }));
    },
    openCart: () => get().fetchGetCartData('open'),
    removeFromCart: (id) => {
      const inCart = get().isProductInCart(id);

      if (!inCart) return;

      const products = get().cart.products.filter((product) => product._id !== id);

      set((state) => ({
        cart: {
          ...state.cart,
          products,
        },
      }));

      get().calculateTotal();
      get().fetchGetCartData('remove', id);
    },
  })),
);
