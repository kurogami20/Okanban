export function controllerWrapper(middleware) {
  return async (req, res, next) => {
    try {
      await middleware(req, res, next);
    } catch (error) {
      console.error(error);
      next(error);
    }
  };
}
