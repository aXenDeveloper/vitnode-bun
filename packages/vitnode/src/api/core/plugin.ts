import { createPluginApi } from '../helpers/plugin';
import { middlewareModule } from './middleware/routes';
import { usersModule } from './users/routes';

export const corePlugin = createPluginApi({
  name: 'core',
  modules: [usersModule, middlewareModule],
});
