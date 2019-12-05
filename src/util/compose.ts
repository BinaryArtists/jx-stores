import { Context, Plugin, ComposeFunc } from '../index.prot';

/**
 * Compose a middleware chain consisting of all the middlewares
 * @param {array} plugins - middlewares user passed
 * @param {object} ctx - middleware context
 * @return {function} middleware chain
 */
export default function compose(plugins: Plugin[], ctx: Context): ComposeFunc {
  return async (...args) => {
    ctx.action.arguments = args;

    function goNext(middleware, next) {
      return async () => {
        return await middleware(ctx, next);
      };
    }
    let next = async () => {
      Promise.resolve();
    };
    plugins.slice().reverse().forEach((middleware) => {
      next = goNext(middleware, next);
    });

    return await next();
  };
}
