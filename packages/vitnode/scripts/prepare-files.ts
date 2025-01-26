/* eslint-disable no-console */
import { existsSync } from 'fs';
import { cp, mkdir } from 'fs/promises';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const copyDatabase = async (pluginsPath: string) => {
  const databasePath = join(__dirname, '..', '..', 'src', 'database');
  if (!existsSync(databasePath)) {
    console.log(
      `⛔️ Database not found in 'src/database' directory. "${databasePath}"`,
    );
    process.exit(1);
  }
  const destinationPath = join(pluginsPath, 'core', 'database');
  if (!existsSync(destinationPath)) {
    await mkdir(destinationPath, { recursive: true });
  }

  // Copy files
  await cp(databasePath, destinationPath, {
    recursive: true,
    filter: src => !src.endsWith('client.ts'),
  });

  // Copy client.ts if it doesn't exist
  if (!existsSync(join(destinationPath, 'client.ts'))) {
    await cp(
      join(databasePath, 'client.ts'),
      join(destinationPath, 'client.ts'),
    );
  }
};

export const prepareFiles = async ({
  pluginsPath,
}: {
  pluginsPath: string;
}) => {
  await copyDatabase(pluginsPath);
};
