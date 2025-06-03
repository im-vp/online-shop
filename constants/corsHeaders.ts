const isDev = process.env.NODE_ENV === 'development';

const allowedOrigins = [process.env.PROD_ORIGIN, process.env.ADMIN_PANEL_ORIGIN];

export const getCorsHeaders = (origin: string | null) => {
  const isAllowed = origin && allowedOrigins.includes(origin);

  return {
    'Access-Control-Allow-Origin': isDev
      ? process.env.DEV_ORIGIN || '*'
      : isAllowed
        ? origin
        : allowedOrigins[0]!,
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Credentials': 'true',
  };
};
