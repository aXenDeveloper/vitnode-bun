#!/usr/bin/env node
/* eslint-disable no-console */
import { existsSync } from 'fs';
import { join } from 'path';

import { prepareDatabase } from './prepare-database.js';
import { prepareFiles } from './prepare-files.js';

const initMessage = '\x1b[34m[VitNode]\x1b[0m';
const getPluginsPath = () => {
  const pluginsPath = join(process.cwd(), 'src', 'plugins');
  if (!existsSync(pluginsPath)) {
    console.log(
      `⛔️ Plugins not found in 'src/plugins' directory. "${pluginsPath}"`,
    );
    process.exit(1);
  }

  return pluginsPath;
};

if (process.argv[2] === 'prepare') {
  console.log(`${initMessage} Preparing files...`);
  void prepareFiles({ pluginsPath: getPluginsPath() });
  console.log(`${initMessage} \x1b[32mFiles prepared successfully.\x1b[0m`);
} else if (process.argv[2] === 'init') {
  await prepareDatabase({ initMessage });
} else {
  console.log(
    `${initMessage} \x1b[31mCommand not found: "${process.argv[2] ?? ''}"\x1b[0m`,
  );
}
