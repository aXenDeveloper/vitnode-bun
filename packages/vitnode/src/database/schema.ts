import * as config from "./schema/config";
import * as users from "./schema/users";
import * as groups from "./schema/groups";

export default {
  ...config,
  ...users,
  ...groups
};
