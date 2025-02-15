import { createPlugin } from '../helpers/plugin';
import { middleware } from './middleware/routes';
import { users } from './users/routes';

export const corePlugin = () => {
  return createPlugin({
    name: 'core',
    modules: [
      {
        name: 'middleware',
        routes: middleware,
      },
      {
        name: 'users',
        routes: users,
      },
    ],
  });
};
