/* eslint-disable no-console */

import { clientDb } from '@/database/client.js';
import { core_config } from '@/database/schema/config.js';
import { core_groups } from '@/database/schema/groups.js';
import {
  core_languages,
  core_languages_words,
} from '@/database/schema/languages.js';
import { count } from 'drizzle-orm';

import { runInteractiveShellCommand } from './run-interactive-shell-command.js';

export const generateDatabaseMigrations = async () => {
  try {
    await runInteractiveShellCommand('npm', ['run', 'drizzle-kit', 'up']);
    await runInteractiveShellCommand('npm', ['run', 'drizzle-kit', 'generate']);
  } catch (err) {
    console.error('\x1b[31m%s\x1b[0m', err);
    process.exit(1);
  }
};

export const runMigrations = async () => {
  try {
    await runInteractiveShellCommand('npm', ['run', 'drizzle-kit', 'migrate']);
  } catch (err) {
    console.error('\x1b[31m%s\x1b[0m', err);
    process.exit(1);
  }
};

export const initialDataForDatabase = async () => {
  const [[config], [groupCount]] = await Promise.all([
    clientDb.select().from(core_config).limit(1),
    clientDb
      .select({
        count: count(),
      })
      .from(core_groups)
      .limit(1),
  ]);
  if (!config) {
    await clientDb.insert(core_config).values([{}]);
  } else {
    await clientDb.update(core_config).set({
      restart_server: false,
    });
  }

  const [languageCount] = await clientDb
    .select({
      count: count(),
    })
    .from(core_languages);
  if (languageCount.count === 0) {
    await clientDb.insert(core_languages).values([
      {
        code: 'en',
        name: 'English (USA)',
        default: true,
        protected: true,
        timezone: 'America/New_York',
      },
    ]);
  }

  if (groupCount.count === 0) {
    const [guestGroup] = await clientDb
      .insert(core_groups)
      .values({
        protected: true,
        guest: true,
        files_allow_upload: false,
      })
      .returning();

    await clientDb.insert(core_languages_words).values({
      language_code: 'en',
      plugin_code: 'core',
      item_id: guestGroup.id,
      value: 'Guest',
      table_name: 'core_groups',
      variable: 'name',
    });

    const [memberGroup] = await clientDb
      .insert(core_groups)
      .values({
        protected: true,
        default: true,
      })
      .returning();

    await clientDb.insert(core_languages_words).values({
      language_code: 'en',
      plugin_code: 'core',
      item_id: memberGroup.id,
      value: 'Member',
      table_name: 'core_groups',
      variable: 'name',
    });

    const [moderatorGroup] = await clientDb
      .insert(core_groups)
      .values({
        protected: true,
        color: 'hsl(122, 80%, 45%)',
      })
      .returning();

    await clientDb.insert(core_languages_words).values({
      language_code: 'en',
      plugin_code: 'core',
      item_id: moderatorGroup.id,
      value: 'Moderator',
      table_name: 'core_groups',
      variable: 'name',
    });

    const [adminGroup] = await clientDb
      .insert(core_groups)
      .values({
        protected: true,
        root: true,
        color: 'hsl(0, 100%, 50%)',
      })
      .returning();

    await clientDb.insert(core_languages_words).values({
      language_code: 'en',
      plugin_code: 'core',
      item_id: adminGroup.id,
      value: 'Administrator',
      table_name: 'core_groups',
      variable: 'name',
    });
  }
};

export const prepareDatabase = async ({
  initMessage,
}: {
  initMessage: string;
}) => {
  console.log(`${initMessage} [1/3] Generate migrations...`);
  await generateDatabaseMigrations();
  console.log(`${initMessage} [2/3] Run migrations...`);
  await runMigrations();
  console.log(`${initMessage} [3/3] Insert initial data...`);
  await initialDataForDatabase();
  console.log(`${initMessage} \x1b[32mDatabase prepared successfully.\x1b[0m`);
  process.exit(0);
};
