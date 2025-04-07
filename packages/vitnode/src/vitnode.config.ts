import { VitNodePlugin } from './plugin.types';

export interface VitNodeConfig {
  debug?: boolean;
  i18n: {
    defaultLocale: string;
    locales: string[];
  };
  metadata: {
    shortTitle?: string;
    title: string;
  };
  plugins: VitNodePlugin[];
}
