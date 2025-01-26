import { runInteractiveShellCommand } from "./run-interactive-shell-command.js";

export const generateDatabaseMigrations = async () => {
  try {
    await runInteractiveShellCommand("npm", ["run", "drizzle-kit", "up"]);
    await runInteractiveShellCommand("npm", ["run", "drizzle-kit", "generate"]);
  } catch (err) {
    console.error("\x1b[31m%s\x1b[0m", err);
    process.exit(1);
  }
};

export const runMigrations = async () => {
  try {
    await runInteractiveShellCommand("npm", ["run", "drizzle-kit", "migrate"]);
  } catch (err) {
    console.error("\x1b[31m%s\x1b[0m", err);
    process.exit(1);
  }
};

export const prepareDatabase = async ({ initMessage }: { initMessage: string }) => {
  console.log(`${initMessage} [1/2] Generate migrations...`);
  await generateDatabaseMigrations();
  console.log(`${initMessage} [2/2] Run migrations...`);
  await runMigrations();
};
