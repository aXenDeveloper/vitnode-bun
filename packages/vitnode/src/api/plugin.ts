import { middlewareModule } from './modules/middleware/middleware.module';
import { usersModule } from './modules/users/users.module';
import { createPluginApi } from './utils/plugin';

export default createPluginApi({
  name: 'core',
  modules: [usersModule, middlewareModule],
});
