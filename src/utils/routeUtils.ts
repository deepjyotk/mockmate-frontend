// src/utils/routeUtils.ts
import PUBLIC_ROUTES from '../config/publicRoutes';

/**
 * Function to check if a given route is public
 * @param route - The current route path
 * @returns boolean - True if the route is public, false otherwise
 */
export const isPublicRoute = (route: string): boolean => {
  return PUBLIC_ROUTES.some((publicRoute) => route.startsWith(publicRoute));
};
