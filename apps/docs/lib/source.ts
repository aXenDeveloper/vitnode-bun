import { docs } from '@/.source';
import { loader } from 'fumadocs-core/source';
import { icons } from 'lucide-react';
import { create } from './icon';

export const source = loader({
  baseUrl: '/docs',
  icon(icon) {
    if (icon && icon in icons)
      return create({ icon: icons[icon as keyof typeof icons] });
  },
  source: docs.toFumadocsSource(),
});
