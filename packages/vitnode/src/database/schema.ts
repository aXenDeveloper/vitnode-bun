import * as config from './schema/config';
import * as groups from './schema/groups';
import * as users from './schema/users';

export default {
  ...config,
  ...users,
  ...groups,
};
