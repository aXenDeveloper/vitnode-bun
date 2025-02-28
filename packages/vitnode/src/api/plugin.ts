import { createPluginApi } from './lib/plugin';
import { middlewareModule } from './modules/middleware/middleware.module';
import { usersModule } from './modules/users/users.module';

export default () => {
  return createPluginApi({
    name: 'core',
    modules: [usersModule(), middlewareModule],
  });
};
