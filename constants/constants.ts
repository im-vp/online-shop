import { SortType } from '@/types/types';

export const POPUP_ID = {
  cart: 'cart',
  authentication: 'authentication',
};
export const AUTH_FORM_TYPE = {
  registration: 'registration',
  authorization: 'authorization',
};

export const CHANGE_HEADER_URLS = ['checkout'];

export const CABINET_MENU_LIST = [
  {
    name: 'Мои данные',
    path: '/cabinet/profile-information',
  },
  {
    name: 'Мои заказы',
    path: '/cabinet/orders',
  },
  {
    name: 'Избранные товары',
    path: '/cabinet/favorites',
  },
];

export const PHONE_MASK = {
  UA: {
    mask: '+38 (___) ___-__-__',
    replacement: { _: /\d/ },
  },
};

export const VALIDATION_FIELDS = {
  required: {
    message: 'Поле обязательно для заполнения',
  },
  onlyLetters: {
    pattern: /^[A-Za-zА-Яа-яЁё]+$/i,
    message: 'Поле должно содержать только буквы',
  },
  onlyLettersAndNumbers: {
    pattern: /^[A-Za-zА-Яа-яЁё0-9]+$/i,
    message: 'Поле должно содержать только буквы и цифры',
  },
  onlyNumbers: {
    pattern: /^[0-9]+$/i,
    message: 'Поле должно содержать только цифры',
  },
  phoneUA: {
    pattern: /^\+38 \(\d{3}\) \d{3}-\d{2}-\d{2}$/,
    message: 'Неверно указан номер телефона',
  },
  email: {
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: 'Некорректный E-mail. Например my-email@domain.net',
  },
  password: {
    pattern: /^(?=.*[A-Za-zА-Яа-яЁё])(?=.*\d)[A-Za-zА-Яа-яЁё\d]{8,}$/,
    message: 'Пароль должен содержать минимум 8 символов, включая буквы и цифры',
  },
};

export const SORT_LIST = [
  {
    name: 'по рейтингу',
    sortProperty: SortType.rating,
  },
  {
    name: 'от дешевых к дорогим',
    sortProperty: SortType.cheap,
  },
  {
    name: 'от дорогих к дешевым',
    sortProperty: SortType.expensive,
  },
];

export const ORDER_STATUS = {
  pending: 'В обработке',
  confirmed: 'Принят',
  shipped: 'Отправленный',
  cancelled: 'Отменен',
  completed: 'Выполнен',
};

export const SPINNER_STYLE = {
  buttonAddCart: {
    display: 'block',
    width: '45px',
    height: '40px',
    backgroundColor: '#1db954',
    borderRadius: '3px',
  },
  buttonAddCartWithText: {
    display: 'block',
    width: '133px',
    height: '40px',
    backgroundColor: '#1db954',
    borderRadius: '3px',
  },
};
