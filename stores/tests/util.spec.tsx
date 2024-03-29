import compose from '../src/util/compose';

describe('#util', () => {
  let handler;

  beforeEach(() => {
    handler = {
      set: (target, prop): boolean => {
        /* eslint no-param-reassign: 0 */
        target[prop] = 'foo';
        return true;
      },
    };
  });

  describe('#compose', () => {
    const arr = [];
    const plugins = [];

    function wait (ms) {
      return new Promise((resolve) => setTimeout(resolve, ms || 1));
    }
    test('should work', async () => {
      plugins.push(async (ctx, next) => {
        arr.push(1);
        await wait(1);
        await next();
        await wait(1);
        arr.push(6);
      });
      plugins.push(async (ctx, next) => {
        arr.push(2);
        await wait(1);
        await next();
        await wait(1);
        arr.push(5);
      });
      plugins.push(async (ctx, next) => {
        arr.push(3);
        await wait(1);
        await next();
        await wait(1);
        arr.push(4);
      });

      const ctx = {
        action: {
          name: '',
          arguments: [],
        },
        store: {
          namespace: 'foo',
          getState: () => { return {}; },
        },
      };
      await compose(plugins, ctx)();
      expect(arr).toEqual([1, 2, 3, 4, 5, 6]);
    });
  });
});
