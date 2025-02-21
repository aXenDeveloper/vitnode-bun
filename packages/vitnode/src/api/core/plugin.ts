import { createPluginApi } from '../helpers/plugin';
import { usersModule } from './users/routes';

export const corePlugin = createPluginApi({
  name: 'core',
  modules: [usersModule],
});
