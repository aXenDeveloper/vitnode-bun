import { createPluginApi } from './utils/plugin';
import { usersModule } from './modules/users/users.module';

export default createPluginApi({
  name: 'core',
  modules: [usersModule],
});
