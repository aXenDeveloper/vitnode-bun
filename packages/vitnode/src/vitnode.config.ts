import { VitNodePlugin } from './plugin.types';

export interface VitNodeConfig {
  debug?: boolean;
  metadata: {
    shortTitle?: string;
    title: string;
  };
  plugins: VitNodePlugin[];
}
