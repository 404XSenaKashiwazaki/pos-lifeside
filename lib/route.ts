export const isMatchRoute = (routes: string[], path: string) =>
  routes.some((route) => path === route || path.startsWith(route + "/"));
