import { pgEnum, pgTable } from 'drizzle-orm/pg-core';

export const appCoreTypeEnum = pgEnum('vitnode_core_app_type', [
  'website',
  'article',
  'book',
  'music.album',
  'music.playlist',
  'music.radio_station',
  'music.song',
  'profile',
  'video.episode',
  'video.movie',
  'video.tv_show',
]);

// export const core_config_files = pgTable("core_config_files", (t) => ({
//       id: t.uuid().defaultRandom().primaryKey(),
//   extension: t.varchar({ length: 32 }).notNull(),
//   file_alt: t.varchar({ length: 255 }),
//   file_name: t.varchar({ length: 255 }).notNull(),
//   file_name_original: t
//     .varchar({
//       length: 255
//     })
//     .notNull(),
//   dir_folder: t.varchar({ length: 255 }).notNull(),
//   created_at: t.timestamp().notNull().defaultNow(),
//   file_size: t.integer().notNull(),
//   mimetype: t.varchar({ length: 255 }).notNull(),
//   width: t.integer(),
//   height: t.integer()
// }));

export const core_config = pgTable('core_config', t => ({
  app_type: appCoreTypeEnum().notNull().default('website'),
  restart_server: t.boolean().notNull().default(false),
  editor_sticky: t.boolean().notNull().default(true),
  site_name: t.varchar({ length: 150 }).notNull().default('VitNode'),
  site_short_name: t.varchar({ length: 75 }).notNull().default('VitNode'),
  contact_email: t.varchar().notNull().default(''),
  last_updated: t.timestamp().notNull().defaultNow(),
  auth_force_login: t.boolean().notNull().default(false),
  auth_lock_register: t.boolean().notNull().default(false),
  auth_require_confirm_email: t.boolean().notNull().default(false),
  admin_note: t.text().notNull().default('Enter your note here. :)'),
  admin_note_updated_at: t.timestamp().notNull().defaultNow(),
}));
