// import { useMemo } from 'react';
// import { useRouter } from 'next/router';

// export const useSelectedRoute = <
//   T extends Omit<RouteProps, 'path'> & { path: string }
// >(
//   routes: T[],
// ): T | undefined => {
//   const location = useLocation();

//   return useMemo(
//     () => routes.find((route) => matchPath(location.pathname, route.path)),
//     [routes, location.pathname],
//   );
// };
