import axios from 'axios';
import * as jose from 'jose';
import { jwtVerify } from 'jose';

import { CHANGE_HEADER_URLS, PHONE_MASK } from '@/constants/constants';
import { ICartProduct, IFilterParams } from '@/types/types';
import { format } from '@react-input/mask';

export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('ru-RU').format(price);
};

export const getFormattedDate = ({
  date,
  locale,
  option,
}: {
  date?: Date;
  locale?: string;
  option?: object;
}) => {
  const dateFormat = date ? date : new Date();
  const localeFormat = locale ? locale : 'ru-RU';
  const optionFormat = option
    ? option
    : { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Europe/Kiev' };

  return dateFormat.toLocaleDateString(localeFormat, optionFormat);
};

export const getStorage = <Type>(name: string): Type => {
  if (typeof window === 'undefined') return null as Type;
  try {
    const storage = localStorage.getItem(name);

    return (storage as Type) || (null as Type);
  } catch (error) {
    console.error(`хранилище с именем ${name} не найдено`, error);
    return null as Type;
  }
};

export const setStorage = (name: string, value: string) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(name, value);
  } catch (error) {
    console.error(`хранилище с именем ${name} не установленно`, error);
  }
};

export const setExpireDay = (val: number) => {
  return val * 60 * 60 * 24;
};

export const generateTokens = async (id: string, email: string) => {
  try {
    const secret = new TextEncoder().encode(process.env.JWT_REFRESH_TOKEN as string);
    const alg = 'HS256';

    const newAccessToken = await new jose.SignJWT({ id, email })
      .setProtectedHeader({ alg })
      .setExpirationTime('45m')
      .sign(secret);

    const newRefreshToken = await new jose.SignJWT({ id, email })
      .setProtectedHeader({ alg })
      .setExpirationTime('5d')
      .sign(secret);

    return {
      newAccessToken,
      newRefreshToken,
    };
  } catch (error) {
    console.error(error);

    return {
      newAccessToken: '',
      newRefreshToken: '',
    };
  }
};

export const isTokenValid = async (token: string) => {
  try {
    const { payload, protectedHeader } = await jwtVerify(
      token,
      new TextEncoder().encode(process.env.JWT_REFRESH_TOKEN as string),
    );
    // console.log('protectedHeader: ', protectedHeader);
    // console.log('payload: ', payload);
    return payload;
  } catch (error) {
    //@ts-ignore
    //console.error('Токен истек:', error.payload);
    return false;
  }
};

export const parseJwt = (token: string) => jose.decodeJwt(token);

export const errorHandler = (error: any): string => {
  if (axios.isAxiosError(error)) {
    console.error('Axios error: ' + error.message);
    console.error('Axios error(2): ' + error.response?.data.message);
    if (error.response?.data.message) {
      return error.response.data.message;
    }
  } else if (error instanceof Error) {
    console.error(error.message);
  } else {
    console.error('Unexpected error: ', error.message);
  }

  return error.message;
};

export const clientErrorHandler = async (error: unknown) => {
  const base = {
    success: false,
    message: 'Произошла ошибка',
    data: null,
    status: 500,
    error,
  };

  // Если ошибка - это Response с телом ошибки от API
  if (error instanceof Response) {
    try {
      const data = await error.json();
      return {
        ...base,
        message: data?.message || base.message,
        status: error.status,
        error: data || error,
      };
    } catch {
      return {
        ...base,
        message: `Ошибка сервера ${error.status} ${error.statusText}`,
        status: error.status,
        error,
      };
    }
  }

  // Ошибка из throw new Error(message)
  if (error instanceof Error) {
    return {
      ...base,
      message: error.message || base.message,
      status: 0, // здесь статус неизвестен, например сеть
      error,
    };
  }

  // Если ошибка — просто строка
  if (typeof error === 'string') {
    return {
      ...base,
      message: error,
      status: 0,
      error,
    };
  }

  // Неизвестный тип ошибки
  return base;
};

export const serverErrorHandler = (error: any) => {
  const base = {
    success: false,
    message: 'Произошла ошибка',
    data: null,
    status: 500,
    error,
  };

  // Если это MongoDB ошибка с подробностями
  if (error?.errorResponse?.errmsg) {
    return {
      ...base,
      message: error.errorResponse.errmsg,
    };
  }
  // Валидационные ошибки (например, Mongoose)
  if (error?.name === 'ValidationError') {
    return {
      ...base,
      message: error.message,
    };
  }
  // Кастомные ошибки
  if (typeof error === 'string') {
    return {
      ...base,
      message: error,
    };
  }
  if (error?.message) {
    return {
      ...base,
      message: error.message,
    };
  }
  return base;
};

export const generateProductCode = (slug: string, date = new Date()) => {
  const dateString = date.toISOString().slice(0, 10).replace(/-/g, ''); // Пример: 20241028
  const categoryPrefix = slug.substring(0, 3).toUpperCase(); // Первые буквы slug-а
  const uniqueId = Math.floor(Math.random() * 10000); // Пример: 1234

  return `${categoryPrefix}-${dateString}-${uniqueId.toString().padStart(4, '0')}`; // CAT-20241028-1234
};

export const getStringFilterParams = (obj: { [key: string]: string }) => {
  let string = '';

  Object.entries(obj).forEach(([key, value], index) => {
    if (value !== undefined && value !== null && value !== '') {
      string += index === 0 ? `?${key}=${value}` : `&${key}=${value}`;
    }
  });

  return string;
};

export const getObjectFilterParams = (searchParams: { [key: string]: string }) => {
  const filterParams: IFilterParams = {};

  for (const key in searchParams) {
    switch (key) {
      case 'sort':
        filterParams.sort = searchParams[key] as string;
        break;
      case 'range':
        const rangeMin = searchParams[key].split('-')[0];
        const rangeMax = searchParams[key].split('-')[1];
        filterParams.range = {
          min: !isNaN(Number(rangeMin)) ? Number(rangeMin) : 0,
          max: !isNaN(Number(rangeMax)) ? Number(rangeMax) : 0,
        };
        break;
      default:
        filterParams.filters = {
          ...filterParams.filters,
          [key]: searchParams[key],
        };
    }
  }

  return filterParams;
};

export const getArrayFilterParams = (obj: IFilterParams) => {
  if (!Object.entries(obj).length) return [];

  const arr: { param: string; value: string }[] = [];

  for (const key in obj) {
    switch (key) {
      case 'sort':
        break;
      case 'range':
        arr.push({
          param: key,
          value: `${obj.range?.min} - ${obj.range?.max} грн`,
        });
        break;
      case 'filters':
        for (const filter in obj.filters) {
          arr.push({
            param: filter,
            value: obj.filters[filter],
          });
        }
        break;
    }
  }

  return arr;
};

export const isCurrentUrlMatch = (currentUrl: string) => {
  const segments = currentUrl.split('/').filter(Boolean);

  return CHANGE_HEADER_URLS.some((url) => segments.some((segment) => segment === url));
};

export const getCartTotalPrice = (array: ICartProduct[]) =>
  array.reduce((total, product) => {
    return total + product.totalPrice;
  }, 0);

export const getCartTotalQuantity = (array: ICartProduct[]) =>
  array.reduce((total, product) => {
    return total + product.quantity;
  }, 0);

export const isPhoneEmptyWithMask = (value: string, mask: string) => value === mask;

export const phoneMaskFormat = (value: string | number) => {
  if (!value) return '';

  const valueString = String(value);
  const cleanedPhone = valueString.startsWith('+38') ? valueString.slice(3).trim() : valueString;

  return format(cleanedPhone, {
    mask: PHONE_MASK.UA.mask,
    replacement: PHONE_MASK.UA.replacement,
  });
};
